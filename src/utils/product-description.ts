export interface ProductDetails {
  size: number | null;
  power: string[];
  waving: boolean | null;
  features: string[];
}

export function normalizeProductDescription(
  description: string | null | undefined,
): ProductDetails {
  const result: ProductDetails = {
    size: null,
    power: [],
    waving: null,
    features: [],
  };

  if (!description?.trim()) return result;

  // Tách nội dung theo dấu phẩy hoặc xuống dòng
  const items = description
    .split(/[,\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  for (const item of items) {
    const normalized = item
      .toLocaleLowerCase("vi-VN")
      .replace(/\s+/g, " ")
      .trim();

    // Kích thước: Size 10, Size 10cm, Mèo size 25cm
    const sizeMatch = normalized.match(
      /(?:mèo\s*)?size\s*(\d+(?:[.,]\d+)?)\s*(?:cm)?/,
    );

    if (sizeMatch) {
      result.size = Number(sizeMatch[1].replace(",", "."));
      continue;
    }

    // Vẫy tay
    if (normalized.includes("không vẫy tay")) {
      result.waving = false;
      continue;
    }

    if (normalized.includes("vẫy tay")) {
      result.waving = true;
      continue;
    }

    // Nguồn năng lượng
    if (normalized.includes("năng lượng mặt trời")) {
      result.power.push("Năng lượng mặt trời");
      continue;
    }

    if (normalized.includes("pin aaa")) {
      result.power.push("Pin AAA");
      continue;
    }

    if (normalized === "pin") {
      result.power.push("Pin");
      continue;
    }

    if (normalized === "điện") {
      result.power.push("Điện");
      continue;
    }

    // Những thông tin chưa nhận diện
    result.features.push(item);
  }

  return result;
}
