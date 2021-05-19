// Override Settings
var bcSfSearchSettings = {
    search: {
        //suggestionMode: 'test',
        //suggestionPosition: 'left'
      
    suggestionMobileStyle: 'style2',
    }
};

// Customize style of Suggestion box
BCSfFilter.prototype.customizeSuggestion = function(suggestionElement, searchElement, searchBoxId) {
};

BCSfFilter.prototype.buildSuggestionProductPrice = function(data) {
    /* Multi-currency Shopify chocolate bars of the world gift box */
    var self = this;
    self.prepareSuggestionProductPriceData(data);
    priceVaries = data.price_min != data.price_max;
    // Check on sale
    var onSale = data.compare_at_price_min > data.price_min;
    // Format price
    var price = this.formatMoney(data.price_min * 100),
        compareAtPrice = this.formatMoney(data.compare_at_price_min * 100);
    if (this.getSettingValue('search.removePriceDecimal')) {
        price = this.removeDecimal(price);
        compareAtPrice = this.removeDecimal(compareAtPrice);
    }
    // Build Price
    var result = '';
    if (this.getSettingValue('search.showSuggestionProductPrice')) {
        result += '<div class="' + this.class.searchSuggestion + '-product-price">';
        if (onSale && this.getSettingValue('search.showSuggestionProductSalePrice')) {
            result += '<s>' + compareAtPrice + '</s>  ';
            result += '<span class="bc-sf-product-sale-price">' + price + '</span>';
        } else {
          if(priceVaries){
            result += '<span class="bc-sf-product-regular-price">from ' + price + '</p>';
          }else{
            result += '<span class="bc-sf-product-regular-price">' + price + '</span>';
          }
        }
        result += '</div>';
    }
    return result;
};