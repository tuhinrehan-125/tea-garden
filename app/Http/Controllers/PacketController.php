<?php

namespace App\Http\Controllers;

use App\Models\Packet;
use Illuminate\Http\Request;
use App\Models\TeaLeafPowder;
use Illuminate\Support\Str;

class PacketController extends Controller
{
    public function index()
    {
        $packets = Packet::with('teaLeafPowder')->get();
        return response()->json($packets);
    }

    public function store(Request $request)
    {
        $powder = TeaLeafPowder::findOrFail($request->powder_id);

        // Ensure the total packet weight does not exceed the powder's weight
        if ($request->weight > $powder->total_weight) {
            return response()->json([
                'message' => 'The packet weight exceeds the available powder weight.',
                'available_weight' => $powder->total_weight
            ], 400);
        }

        // Create the packet
        $packet = Packet::create([
            'packet_number' => Str::random(10),
            'packet_name' => $request->packet_name,
            'weight' => $request->weight,
            'price' => $request->price,
            'powder_id' => $request->powder_id
        ]);

        // Deduct the packet weight from the powder
        $powder->total_weight -= $request->weight;
        $powder->save();

        // return response()->json($packet->load('teaLeafPowder'));
        return response()->json([
            'packet' => $packet->load('teaLeafPowder'),
            'remaining_weight' => $powder->total_weight
        ]);
    }

    public function show($id)
    {
        $packet = Packet::with('teaLeafPowder')->findOrFail($id);
        return response()->json($packet);
    }

    public function update(Request $request, $id)
    {
        $packet = Packet::findOrFail($id);
        $powder = TeaLeafPowder::findOrFail($packet->powder_id);

        // Restore the packet weight to the powder before updating
        $powder->total_weight += $packet->weight;

        // Ensure the updated packet weight doesn't exceed the available powder weight
        if ($request->weight > $powder->total_weight) {
            return response()->json([
                'message' => 'The updated packet weight exceeds the available powder weight.',
                'available_weight' => $powder->total_weight
            ], 400);
        }

        // Update packet details
        $packet->packet_name = $request->packet_name;
        $packet->weight = $request->weight;
        $packet->price = $request->price;
        $packet->save();

        // Deduct the new packet weight from the powder
        $powder->total_weight -= $packet->weight;
        $powder->save();

        return response()->json($packet->load('teaLeafPowder'));
    }

    public function destroy($id)
    {
        $packet = Packet::findOrFail($id);
        $powder = TeaLeafPowder::findOrFail($packet->powder_id);

        // Add the packet weight back to the powder
        $powder->total_weight += $packet->weight;
        $powder->save();

        // Delete the packet
        $packet->delete();

        return response()->json(['message' => 'Packet deleted successfully']);
    }

    public function search($search_term)
    {
        // Search by packet_number or packet_name
        $packet = Packet::with([
            'teaLeafPowder' => function($query) {
                $query->with(['sacks' => function($query) {
                    $query->with('invoice'); // Load invoice for each sack
                }]);
            }
        ])
        ->where('packet_number', $search_term)
        ->orWhere('packet_name', 'LIKE', "%{$search_term}%")
        ->first();

        // If the packet is not found
        if (!$packet) {
            return response()->json(['message' => 'Packet not found'], 404);
        }

        // Prepare the response data
        $response = [
            'packet_number' => $packet->packet_number,
            'packet_name' => $packet->packet_name,
            'packet_weight' => $packet->weight,
            'packet_price' => $packet->price,
            'powder' => [
                'powder_number' => $packet->teaLeafPowder->powder_number,
                'powder_name' => $packet->teaLeafPowder->powder_name,
                // 'powder_total_weight' => $packet->teaLeafPowder->total_weight,
                'powder_initial_weight' => $packet->teaLeafPowder->initial_weight,
                'sacks' => []
            ]
        ];

        // Include the details of each sack used to create the powder
        foreach ($packet->teaLeafPowder->sacks as $sack) {
            $response['powder']['sacks'][] = [
                'sack_number' => $sack->sack_number,
                'sack_name' => $sack->sack_name,
                'sack_weight' => $sack->initial_weight,
                'invoice' => [
                    'invoice_number' => $sack->invoice->invoice_number,
                    'place_name' => $sack->invoice->place_name
                ]
            ];
        }

        return response()->json($response);
    }
}
