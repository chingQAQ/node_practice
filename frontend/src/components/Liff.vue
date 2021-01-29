<script>
  import liff from '@line/liff';

  export default {
    name: 'liff',
    data: () => ({
    }),
    mounted() {
      liff
        .init({ liffId: process.env.LINE_LIFF_ID })
        .then(() => {
          if(!liff.isLoggedIn()) {
            // liff.login();
          }
        })
    },
  }
</script>

<template>
  <div>
  </div>
</template>
