<?php

namespace App\Http\Controllers;

use App\Models\Sack;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SackController extends Controller
{
    public function index()
    {
        $sacks = Sack::all();
        return response()->json($sacks);
    }

    public function store(Request $request)
    {
        $invoice = Invoice::findOrFail($request->invoice_id);
        

        if ($request->weight > $invoice->weight) {
            return response()->json([
                'message' => 'The sack weight exceeds the remaining invoice weight.',
                'remaining_weight' => $invoice->weight
            ], 400);
        }

        $sack = new Sack;
        $sack->sack_name = $request->sack_name;
        $sack->sack_number = Str::random(10);
        $sack->weight = $request->weight;
        $sack->initial_weight = $request->weight;
        $sack->invoice_id = $request->invoice_id;
        $sack->save();

        // Deduct the sack weight from the invoice weight
        $invoice->weight -= $sack->weight;
        $invoice->save();

        return response()->json([
            'sack' => $sack,
            'remaining_weight' => $invoice->weight
        ]);
    }

    public function show($id)
    {
        return Sack::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $sack = Sack::findOrFail($id);
        $invoice = Invoice::findOrFail($sack->invoice_id);

        // Calculate the difference between the new weight and the old weight
        $oldWeight = $sack->weight;
        $newWeight = $request->weight;

        // Total weight of all sacks excluding the current sack
        $totalSackWeight = Sack::where('invoice_id', $sack->invoice_id)
            ->where('id', '!=', $id) // Exclude the current sack from the sum
            ->sum('weight');

        // Add old sack weight to remaining weight
        $remainingWeight = $invoice->weight + $oldWeight; 

        // Check if the new sack weight exceeds the available weight
        if ($newWeight > $remainingWeight) {
            return response()->json([
                'message' => 'The updated sack weight exceeds the remaining invoice weight.',
                'remaining_weight' => $remainingWeight
            ], 400);
        }

        // Adjust the invoice weight based on the change in sack weight
        if ($newWeight > $oldWeight) {
            $invoice->weight -= ($newWeight - $oldWeight);
        } else {
            $invoice->weight += ($oldWeight - $newWeight);
        }

        // Save the updated sack weight
        $sack->sack_name = $request->sack_name;
        $sack->weight = $newWeight;
        $sack->invoice_id = $request->invoice_id;
        $sack->save();

        // Save the updated invoice weight
        $invoice->save();

        return response()->json([
            'sack' => $sack,
            'remaining_weight' => $invoice->weight
        ]);
    }

    public function destroy($id)
    {
        $sack = Sack::findOrFail($id);
        $invoice = Invoice::findOrFail($sack->invoice_id);

        // Add the deleted sack's weight back to the invoice weight
        $invoice->weight += $sack->weight;
        $invoice->save();

        $sack->delete();
        
        return response()->json(['message' => 'Sack deleted successfully']);
    }
}
