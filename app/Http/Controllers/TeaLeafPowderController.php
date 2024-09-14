<?php

namespace App\Http\Controllers;

use App\Models\Sack;
use App\Models\TeaLeafPowder;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TeaLeafPowderController extends Controller
{
    public function index()
    {
        $powders = TeaLeafPowder::with('sacks')->get();
        return response()->json($powders);
    }

    public function store(Request $request)
    {
        $totalWeight = 0;

        // Calculate the total weight of the powder from the sacks
        foreach ($request->sacks as $sackData) {
            $sack = Sack::findOrFail($sackData['sack_id']);
            $totalWeight += $sackData['weight_used'];

            // Check if the requested weight exceeds the sack's remaining weight
            if ($sackData['weight_used'] > $sack->weight) {
                return response()->json([
                    'message' => "Not enough weight in sack {$sack->id}.",
                    'remaining_weight' => $sack->weight
                ], 400);
            }
        }

        // Create a new tea leaf powder record
        $powder = TeaLeafPowder::create([
            'powder_number' => Str::random(10),
            'powder_name' => $request->powder_name,
            'total_weight' => $totalWeight,
            'initial_weight' => $totalWeight,
        ]);

        // Link the powder with the sacks and deduct the weight
        foreach ($request->sacks as $sackData) {
            $sack = Sack::findOrFail($sackData['sack_id']);
            $powder->sacks()->attach($sack->id, ['weight_used' => $sackData['weight_used']]);

            // Deduct the used weight from the sack
            $sack->weight -= $sackData['weight_used'];
            $sack->save();
        }

        return response()->json($powder->load('sacks'));
    }

    // public function show($id)
    // {
    //     $powder = TeaLeafPowder::with('sacks')->findOrFail($id);
    //     return response()->json($powder);
    // }
    public function show($id)
    {
        $powder = TeaLeafPowder::with('sacks')->findOrFail($id);
        
        // Ensure the response includes all necessary data
        $powder->sacks = $powder->sacks->map(function($sack) {
            return [
                'sack_id' => $sack->id,
                'weight_used' => $sack->pivot->weight_used, // This should be from the pivot table
                'sack_number' => $sack->sack_number,
            ];
        });

        return response()->json($powder);
    }


    public function update(Request $request, $id)
    {
        $powder = TeaLeafPowder::findOrFail($id);

        // First, restore the previous weights back to the sacks
        foreach ($powder->sacks as $sack) {
            $sack->weight += $sack->pivot->weight_used; // Restore the weight
            $sack->save();
        }

        // Detach the old sacks from the powder (since we'll re-attach them with updated weights)
        $powder->sacks()->detach();

        // Calculate the total new weight for the powder
        $totalWeight = 0;

        foreach ($request->sacks as $sackData) {
            $sack = Sack::findOrFail($sackData['sack_id']);
            $totalWeight += $sackData['weight_used'];

            // Check if the requested weight exceeds the sack's remaining weight
            if ($sackData['weight_used'] > $sack->weight) {
                return response()->json([
                    'message' => "Not enough weight in sack {$sack->id}.",
                    'remaining_weight' => $sack->weight
                ], 400);
            }
        }

        // Update the powder's details
        $powder->powder_name = $request->powder_name;
        $powder->total_weight = $totalWeight;
        $powder->save();

        // Attach the sacks with the new weights and deduct the used weight from each sack
        foreach ($request->sacks as $sackData) {
            $sack = Sack::findOrFail($sackData['sack_id']);
            $powder->sacks()->attach($sack->id, ['weight_used' => $sackData['weight_used']]);

            // Deduct the used weight from the sack
            $sack->weight -= $sackData['weight_used'];
            $sack->save();
        }

        return response()->json($powder->load('sacks'));
    }

    public function destroy($id)
    {
        $powder = TeaLeafPowder::findOrFail($id);

        // Return the used weight to the sacks
        foreach ($powder->sacks as $sack) {
            $sack->weight += $sack->pivot->weight_used;
            $sack->save();
        }

        // Delete the powder and detach sacks
        $powder->sacks()->detach();
        $powder->delete();

        return response()->json(['message' => 'Tea leaf powder deleted successfully']);
    }
}
