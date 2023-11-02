<template>
<div class="mt-14">
  <h1>Heading 1</h1>
  <h2>Heading 2</h2>
  <h3>Heading 3</h3>
  <h4>Heading 4</h4>
  <h5>Heading 5</h5>
  <h6>Heading 6</h6>
       <v-btn-primary class="foobar">Foobar</v-btn-primary>
       <button class="v-btn v-btn--primary text-none foobar mx-4">Fizzbuzz</button>
       <v-btn-primary>Primary</v-btn-primary>
  </div>
</template>
<script>
export default {
  name: 'component',
}
</script>
<style>
  .v-btn.v-btn--primary {
    background: linear-gradient(to right, #ff8a00, #da1b60);
    color: white;
  }
  .v-btn.v-btn--secondary {
    background: linear-gradient(to right, #da1b60, #ff8a00);
    color: white;
  }
</style>