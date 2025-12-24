<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VideoController extends Controller
{
    public function index(Request $request)
    {
        $query = Video::with('user:id,name');

        if (!$request->user() || !$request->user()->isAdmin()) {
            $query->where('is_restricted', false);
        }

        $videos = $query->latest()->get();

        return response()->json($videos);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'video' => 'required|file|mimes:mp4,mov,avi,wmv|max:102400', // 100MB
        ]);

        $videoPath = $request->file('video')->store('videos', 'public');

        $video = $request->user()->videos()->create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? '',
            'video_path' => $videoPath,
        ]);

        return response()->json($video, 201);
    }

    public function show($id)
    {
        $video = Video::with(['user:id,name', 'comments.user:id,name'])->findOrFail($id);

        return response()->json($video);
    }

    public function update(Request $request, $id)
    {
        $video = Video::findOrFail($id);

        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'is_restricted' => 'required|boolean',
        ]);

        $video->update($validated);

        return response()->json($video);
    }

    public function destroy(Request $request, $id)
    {
        $video = Video::findOrFail($id);

        if (!$request->user()->isAdmin() && $video->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        Storage::disk('public')->delete($video->video_path);
        $video->delete();

        return response()->json(['message' => 'Video deleted successfully']);
    }
}