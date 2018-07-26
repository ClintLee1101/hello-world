<template>
    <div class="about">
      <h1>{{ msg }}</h1>
      使用以下技术栈：<br/>
      vue+webpack+vue-router+vue-resource
    </div>
</template>

<script>
  export default {
    name: 'about',
    data () {
      return {
        msg: 'about',
        prodList : [],
      }
    },
    computed: {
        filteredProdList () {
            return this.prodList.filter(function(prod) {
                if(prod.id > 100 ) return true;
              });
        }
    },
    methods: {
    },
    created() {
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>
  .about {
    h1 {font-size:1em;}
  }
</style>
