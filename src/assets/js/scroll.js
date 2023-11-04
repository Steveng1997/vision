var ultimoScroll = 0;
var cero = 0;
document.addEventListener('scroll', function () {
    st = window.scrollTop();
    if (st > ultimoScroll) {
        $('nav.navbar').addClass('hide');
    } else {
        $('nav.navbar').removeClass('hide');
    }
})