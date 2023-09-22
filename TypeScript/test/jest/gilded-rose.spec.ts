import { Item, GildedRose, ITEM_UPDATE_STRATEGIES } from "@/gilded-rose";

describe("Gilded Rose", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Regular items", () => {
    it("should lower quality", () => {
      const sut = new GildedRose([
        new Item("foo", 10, 5),
        new Item("bar", 4, 8),
      ]);
      const expectedQualities = [
        [4, 7],
        [3, 6],
        [2, 5],
      ];
      for (const expectedQuality of expectedQualities) {
        const items = sut.updateQuality();
        expect(items.map((i) => i.quality)).toEqual(expectedQuality);
      }
    });

    it("should reduce sellIn", () => {
      const sut = new GildedRose([
        new Item("foo", 10, 5),
        new Item("bar", 2, 8),
      ]);
      const expectedSellInValues = [
        [9, 1],
        [8, 0],
        [7, -1],
      ];
      for (const expectedSellIn of expectedSellInValues) {
        const items = sut.updateQuality();
        expect(items.map((i) => i.sellIn)).toEqual(expectedSellIn);
      }
    });

    it("should lower quality twice as fast after sellIn", () => {
      const sut = new GildedRose([
        new Item("foo", 1, 5),
        new Item("bar", 4, 8),
      ]);
      const expectedQualities = [
        [4, 7],
        [2, 6],
        [0, 5],
      ];
      for (const expectedQuality of expectedQualities) {
        const items = sut.updateQuality();
        expect(items.map((i) => i.quality)).toEqual(expectedQuality);
      }
    });

    it("should never lower quality below 0", () => {
      const sut = new GildedRose([
        new Item("foo", 10, 1),
        new Item("bar", 4, 8),
      ]);
      const expectedQualities = [
        [0, 7],
        [0, 6],
        [0, 5],
      ];
      for (const expectedQuality of expectedQualities) {
        const items = sut.updateQuality();
        expect(items.map((i) => i.quality)).toEqual(expectedQuality);
      }
    });
  });

  describe("Aged Brie", () => {
    it("should increase quality", () => {
      const sut = new GildedRose([
        new Item("Aged Brie", 10, 1),
        new Item("bar", 4, 8),
      ]);
      const expectedQualities = [
        [2, 7],
        [3, 6],
        [4, 5],
      ];
      for (const expectedQuality of expectedQualities) {
        const items = sut.updateQuality();
        expect(items.map((i) => i.quality)).toEqual(expectedQuality);
      }
    });

    it("should not increase quality over 50", () => {
      const sut = new GildedRose([
        new Item("Aged Brie", 10, 48),
        new Item("bar", 4, 8),
      ]);
      const expectedQualities = [
        [49, 7],
        [50, 6],
        [50, 5],
      ];
      for (const expectedQuality of expectedQualities) {
        const items = sut.updateQuality();
        expect(items.map((i) => i.quality)).toEqual(expectedQuality);
      }
    });
  });

  describe("Sulfuras", () => {
    it("should not change quality", () => {
      const sut = new GildedRose([
        new Item("Sulfuras, Hand of Ragnaros", 1, 80),
        new Item("bar", 4, 8),
      ]);
      const expectedQualities = [
        [80, 7],
        [80, 6],
        [80, 5],
      ];
      for (const expectedQuality of expectedQualities) {
        const items = sut.updateQuality();
        expect(items.map((i) => i.quality)).toEqual(expectedQuality);
      }
    });

    it("should not change sellIn", () => {
      const sut = new GildedRose([
        new Item("Sulfuras, Hand of Ragnaros", 10, 80),
        new Item("bar", 4, 8),
      ]);
      const expectedSellInValues = [
        [10, 3],
        [10, 2],
        [10, 1],
      ];
      for (const expectedSellIn of expectedSellInValues) {
        const items = sut.updateQuality();
        expect(items.map((i) => i.sellIn)).toEqual(expectedSellIn);
      }
    });
  });

  describe("Backstage passes", () => {
    it("should increase quality", () => {
      const sut = new GildedRose([
        new Item("Backstage passes to a TAFKAL80ETC concert", 20, 5),
        new Item("bar", 4, 8),
      ]);
      const expectedQualities = [
        [6, 7],
        [7, 6],
        [8, 5],
      ];
      for (const expectedQuality of expectedQualities) {
        const items = sut.updateQuality();
        expect(items.map((i) => i.quality)).toEqual(expectedQuality);
      }
    });

    it("should not increase quality over 50", () => {
      const sut = new GildedRose([
        new Item("Backstage passes to a TAFKAL80ETC concert", 20, 48),
        new Item("bar", 4, 8),
      ]);
      const expectedQualities = [
        [49, 7],
        [50, 6],
        [50, 5],
      ];
      for (const expectedQuality of expectedQualities) {
        const items = sut.updateQuality();
        expect(items.map((i) => i.quality)).toEqual(expectedQuality);
      }
    });

    it("should increase quality by 2 when 10 days or less", () => {
      const sut = new GildedRose([
        new Item("Backstage passes to a TAFKAL80ETC concert", 11, 5),
        new Item("bar", 15, 8),
      ]);
      const expectedQualities = [
        [6, 7],
        [8, 6],
        [10, 5],
        [12, 4],
        [14, 3],
      ];
      for (const expectedQuality of expectedQualities) {
        const items = sut.updateQuality();
        expect(items.map((i) => i.quality)).toEqual(expectedQuality);
      }
    });

    it("should increase quality by 3 when 5 days or less", () => {
      const sut = new GildedRose([
        new Item("Backstage passes to a TAFKAL80ETC concert", 6, 5),
        new Item("bar", 15, 8),
      ]);
      const expectedQualities = [
        [7, 7],
        [10, 6],
        [13, 5],
        [16, 4],
        [19, 3],
      ];
      for (const expectedQuality of expectedQualities) {
        const items = sut.updateQuality();
        expect(items.map((i) => i.quality)).toEqual(expectedQuality);
      }
    });

    it("should drop quality to 0 after sellIn", () => {
      const sut = new GildedRose([
        new Item("Backstage passes to a TAFKAL80ETC concert", 2, 5),
        new Item("bar", 15, 8),
      ]);
      const expectedQualities = [
        [8, 7],
        [11, 6],
        [0, 5],
        [0, 4],
      ];
      for (const expectedQuality of expectedQualities) {
        const items = sut.updateQuality();
        expect(items.map((i) => i.quality)).toEqual(expectedQuality);
      }
    });
  });

  describe("Conjured items", () => {
    it("should decrease quality twice as fast", () => {
      const sut = new GildedRose([
        new Item("Conjured item", 2, 15),
        new Item("bar", 10, 8),
      ]);
      const expectedQualities = [
        [13, 7], // -2
        [11, 6], // -2
        [7, 5], // -4
        [3, 4], // -4
        [0, 3], // =0
        [0, 2], // =0
      ];
      for (const expectedQuality of expectedQualities) {
        const items = sut.updateQuality();
        expect(items.map((i) => i.quality)).toEqual(expectedQuality);
      }
    });
  });

  it("should throw when no matching update strategies", () => {
    jest
      .spyOn(ITEM_UPDATE_STRATEGIES.slice(-1)[0], "isForItem")
      .mockReturnValue(false);
    const sut = new GildedRose([new Item("foo", 2, 5)]);
    expect(() => sut.updateQuality()).toThrowError(
      /Unable to find a matching update strategy/
    );
  });
});
