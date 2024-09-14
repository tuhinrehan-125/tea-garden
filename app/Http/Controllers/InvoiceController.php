<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Invoice;
use Illuminate\Support\Str;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::all();
        return response()->json($invoices);
        // return response()->json([
        //     'invoices' => $invoices, 
        //     'page' => $page,
        //     'pages' => $pages
        // ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'place_name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'weight' => 'required|numeric|min:0.1',
        ]);

        $invoice = new Invoice;
        $invoice->place_name = $request->place_name;
        $invoice->invoice_number = Str::random(10); // unique invoice number
        $invoice->price = $request->price;
        $invoice->weight = $request->weight;
        $invoice->initial_weight = $request->weight;
        $invoice->save();

        return response()->json($invoice, 201);
    }

    public function show($id)
    {
        return Invoice::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'place_name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'weight' => 'required|numeric|min:0.1',
        ]);

        $invoice = Invoice::findOrFail($id);
        $invoice->place_name = $request->place_name;
        $invoice->price = $request->price;
        $invoice->weight = $request->weight;
        $invoice->save();

        return response()->json($invoice);
    }

    public function destroy($id)
    {
        Invoice::findOrFail($id)->delete();
        return response()->json(['message' => 'Invoice deleted successfully']);
    }
}
