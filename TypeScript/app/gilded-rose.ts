export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

interface ItemUpdateStrategy {
  /**
   * Determines whether the specified item qualifies for this strategy.
   * @param item The item to check.
   * @returns `true` if the item qualifies, `false` otherwise.
   */
  isForItem(item: Item): boolean;

  /**
   * Updates the item quality and sellIn values according to the strategy rules.
   * @param item The item to update.
   */
  updateItem(item: Item): void;
}

class LegendaryItemUpdateStrategy implements ItemUpdateStrategy {
  isForItem(item: Item): boolean {
    return item.name.startsWith("Sulfuras");
  }

  updateItem(item: Item): void {
    // Nothing changes for legendary items.
  }
}

/**
 * The list of supported item update strategies.
 *
 * NOTE: The order of items in this array is important. Several
 * update strategies can return `true` from `isForItem()` for
 * the same item. The first update strategy to return `true` will
 * be used for the item.
 */
const ITEM_UPDATE_STRATEGIES = [new LegendaryItemUpdateStrategy()];

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];

      const updateStrategy = this._getUpdateStrategyForItem(item);
      if (updateStrategy) {
        updateStrategy.updateItem(item);
        continue;
      }

      if (
        item.name != "Aged Brie" &&
        item.name != "Backstage passes to a TAFKAL80ETC concert"
      ) {
        if (item.quality > 0) {
          item.quality -= 1;
        }
      } else {
        if (item.quality < 50) {
          item.quality += 1;
          if (item.name == "Backstage passes to a TAFKAL80ETC concert") {
            if (item.sellIn < 11) {
              if (item.quality < 50) {
                item.quality += 1;
              }
            }
            if (item.sellIn < 6) {
              if (item.quality < 50) {
                item.quality += 1;
              }
            }
          }
        }
      }
      item.sellIn -= 1;
      if (item.sellIn < 0) {
        if (item.name != "Aged Brie") {
          if (item.name != "Backstage passes to a TAFKAL80ETC concert") {
            if (item.quality > 0) {
              item.quality -= 1;
            }
          } else {
            item.quality = 0;
          }
        } else {
          if (item.quality < 50) {
            item.quality += 1;
          }
        }
      }
    }

    return this.items;
  }

  _getUpdateStrategyForItem(item: Item): ItemUpdateStrategy | undefined {
    for (const strategy of ITEM_UPDATE_STRATEGIES) {
      if (strategy.isForItem(item)) {
        return strategy;
      }
    }
  }
}
