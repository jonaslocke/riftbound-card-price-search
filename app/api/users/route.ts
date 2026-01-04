import { NextRequest, NextResponse } from "next/server";

const ORIGNAL_USERS = [
  "andrei2804@gmail.com",
  "bsantosanisio@gmail.com",
  "caiov.borges32@gmail.com",
  "calheira15@gmail.com",
  "daniel.mota@globant.com",
  "fteive@gmail.com",
  "genilton.jr@gmail.com",
  "gugagaviao@gmail.com",
  "henriquegabriel.boschetti@gmail.com",
  "jonaslocke@gmail.com",
  "lucasvaz.ssm@gmail.com",
  "mendesss.breno@gmail.com",
  "pedroluizfracassi@gmail.com",
  "ramonsousadossantos@gmail.com",
  "tenazlima@gmail.com",
  "xxsoaferxx@gmail.com",
];

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "I'm Alive" });
}
