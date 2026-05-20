import { Prisma } from "@prisma/client";

type PromotionEvaluationInput = {
    promoCode?: string;
    subtotal: number;
};

type AppliedPromotion = {
    promocionId: number;
    discountAmount: number;
    metadata: Prisma.InputJsonValue;
};

export type PromotionCalculationResult = {
    discountTotal: number;
    appliedPromotions: AppliedPromotion[];
};

export async function calculatePromotions(
    _tx: Prisma.TransactionClient,
    input: PromotionEvaluationInput
): Promise<PromotionCalculationResult> {
    if (!input.promoCode) {
        return { discountTotal: 0, appliedPromotions: [] };
    }

    return { discountTotal: 0, appliedPromotions: [] };
}
