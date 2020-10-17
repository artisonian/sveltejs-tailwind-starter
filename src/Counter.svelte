<script>
  let count = 0;

  function onClick() {
    count += 1;
  }
</script>

<button
  class="px-3 py-2 rounded bg-blue-500 text-white text-sm leading-5 font-semibold active:bg-blue-700"
  on:click={onClick}>Clicked
  {count}
  {count === 1 ? 'time' : 'times'}</button>
