$(document).ready(_ => {
    const $sliderContainer = $('#product-slide');
    //const $sliderParent = $sliderContainer.parent();
    const SCREENS = {
        0: 325,
        650: 600,
        950: 900,
        1200: 1200
    }

    function onResize() {
        const curW = window.innerWidth;
        const sliderWidth = Object.keys(SCREENS).reduce((acc, x) => (curW > x) ? SCREENS[x] : acc , SCREENS[0]);
        $sliderContainer.css('max-width', sliderWidth);
        $('#product-slide').appendTo('.image-container');
        if(curW < 650){
            $('.image-container > .image-contain').css('display', 'none');
            $('#product-slide').css('display', 'block'); 
            $('.image-container').off('click'); 
        } else {
            $('#product-slide').css('display', 'none'); 
            $('.image-container > .image-contain').css('display', 'block');
        }
    }

    $(window).resize(_ => {
        onResize()
        // console.log($sliderContainer.css('max-width'))
    })

    onResize()

    const Slider = new Glide('#product-slide', {
        type: 'carousel',
        perView: 1,
        dots: '.dots',
    });

    Slider.mount()

    $( ".product-thumb-img" ).on( "click", function() {
        $( '#product-slide' ).slick('slickGoTo', 1);
    });
})