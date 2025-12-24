<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Like;
use App\Models\Video;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function toggle(Request $request, $videoId)
    {
        $validated = $request->validate([
            'type' => 'required|in:like,dislike',
        ]);

        $video = Video::findOrFail($videoId);
        $user = $request->user();

        $existingLike = Like::where('user_id', $user->id)
            ->where('video_id', $video->id)
            ->first();

        if ($existingLike) {
            if ($existingLike->type === $validated['type']) {
                // Remove like/dislike
                if ($existingLike->type === 'like') {
                    $video->decrement('likes_count');
                } else {
                    $video->decrement('dislikes_count');
                }
                $existingLike->delete();
                return response()->json(['message' => 'Removed', 'action' => 'removed']);
            } else {
                // Change from like to dislike or vice versa
                if ($existingLike->type === 'like') {
                    $video->decrement('likes_count');
                    $video->increment('dislikes_count');
                } else {
                    $video->decrement('dislikes_count');
                    $video->increment('likes_count');
                }
                $existingLike->update(['type' => $validated['type']]);
                return response()->json(['message' => 'Updated', 'action' => 'updated']);
            }
        } else {
            // Add new like/dislike
            Like::create([
                'user_id' => $user->id,
                'video_id' => $video->id,
                'type' => $validated['type'],
            ]);

            if ($validated['type'] === 'like') {
                $video->increment('likes_count');
            } else {
                $video->increment('dislikes_count');
            }

            return response()->json(['message' => 'Added', 'action' => 'added']);
        }
    }
}