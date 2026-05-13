    $(document).ready(function () {
    const $menu = $('#navbarSupportedContent');
    const $overlay = $('#mobileOverlay');
    const $closeBtn = $('#closeMenuBtn');

    $('.navbar-toggler').on('click', function () {
        $menu.addClass('show');
        $overlay.addClass('active');
    });

    $closeBtn.on('click', function () {
        $menu.removeClass('show');
        $overlay.removeClass('active');
    });

    $overlay.on('click', function () {
        $menu.removeClass('show');
        $overlay.removeClass('active');
    });
});