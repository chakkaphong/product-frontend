let products: { id: number, code: string }[] = [];

export async function GET() {
  return Response.json(products);
}

export async function POST(req: Request) {
  const { code } = await req.json();
  const newProduct = { id: Date.now(), code };
  products.push(newProduct);
  return Response.json(newProduct);
}


export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  products = products.filter(p => p.id !== id);
  return Response.json({ success: true });
}
