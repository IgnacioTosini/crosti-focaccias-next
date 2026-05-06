import { NextRequest, NextResponse } from "next/server";

const normalizeMessage = (value: string) =>
    value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

const replyMap = [
    {
        keywords: ["que focaccias tienen", "focaccias tienen", "menu", "focaccias"],
        text: "Podés ver las focaccias disponibles en la sección \"Nuestras Focaccias\" de esta misma página. Ahí vas a encontrar variedades, precios y cuáles están destacadas. 🍕",
    },
    {
        keywords: ["veganas", "vegana", "vegetar"],
        text: "Sí, tenemos opciones aptas para quienes buscan alternativas sin carne. Revisá la etiqueta correspondiente en cada focaccia del menú para elegir la ideal. 🌱",
    },
    {
        keywords: ["cuanto cuesta", "precio", "precios", "sale"],
        text: "Los precios se muestran directamente en cada tarjeta del menú para que puedas verlos al instante. Si querés, elegí tu favorita y te guiamos con el pedido. 💰",
    },
    {
        keywords: ["como hago un pedido", "como pedir", "pedido"],
        text: "Podés hacer tu pedido por WhatsApp o por Instagram DM. Tomamos pedidos para el finde y conviene confirmarlo con anticipación. 🛒",
    },
    {
        keywords: ["delivery", "envio", "retiro"],
        text: "Hacemos entregas en zonas de Mar del Plata y también contamos con opción de retiro. 🚚",
    },
    {
        keywords: ["ingredientes", "usan", "que trae"],
        text: "Cada focaccia detalla sus ingredientes en la tarjeta del menú para que puedas revisar sabores y combinaciones antes de pedir. 🌿",
    },
    {
        keywords: ["horario", "horarios", "cuando atienden"],
        text: "Para coordinar horarios y disponibilidad, escribinos por WhatsApp o Instagram y te respondemos con la info actualizada. 🕐",
    },
    {
        keywords: ["donde estan", "ubicacion", "mar del plata"],
        text: "Estamos en Mar del Plata. También podés encontrarnos en Instagram como @crosti.focaccias para coordinar tu pedido. 📍",
    },
];

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const message = String(body?.message ?? "");
        const normalized = normalizeMessage(message);

        const match = replyMap.find((reply) =>
            reply.keywords.some((keyword) => normalized.includes(keyword))
        );

        const fallback =
            "Ahora mismo no tengo esa respuesta exacta, pero te puedo ayudar con el menú, precios, pedidos y horarios. También podés escribirnos por WhatsApp para una respuesta rápida. 🤖";

        return NextResponse.json({
            message: match?.text ?? fallback,
            conversationId: String(body?.conversationId ?? "local-crosti-chat"),
            success: true,
        });
    } catch (error) {
        console.error("Error handling chatbot request:", error);
        return NextResponse.json(
            {
                message: "Error communicating with chatbot",
                success: false,
            },
            { status: 500 }
        );
    }
}
