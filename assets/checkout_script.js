<script>
$(document).ready(function() {
  $('#checkout_reduction_code').change('click', function() {
    if ($(this).val() == 'FREEBRACELET') {
      $.ajax({
        url: '/cart/update.js',
        method: 'POST',
        dataType: 'json',
        data: {
          updates: {[VARIANT_ID OF FREE PRODUCT]: 1}
        }
      }).then(function(data) {
        location.reload();
      });
    }
  });
});
</script>