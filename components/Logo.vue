<template>
  <NuxtLink 
    to="/" 
    class="logo-wrapper inline-block group cursor-pointer select-none active:scale-90 transition-transform duration-150 ease-out" 
    aria-label="Home"
  >
    <div class="relative w-12 h-12 sm:w-16 sm:h-16 logo-head">
      <img 
        src="/cat.png" 
        alt="Giulio Tognetto Logo"
        class="absolute inset-0 w-full h-full object-contain transition-all duration-250 group-hover:opacity-0 group-hover:scale-95"
      />
      
      <img 
        src="/cat-tongue.png" 
        alt="Giulio Tognetto Logo Alt"
        class="absolute inset-0 w-full h-full object-contain opacity-0 scale-95 transition-all duration-250 group-hover:opacity-100 group-hover:scale-105"
      />

    </div>
  </NuxtLink>
</template>

<style scoped>
/* Animazione "Head Tilt": scatto di curiosità tipico del gatto */
@keyframes catHeadTilt {
  0% { 
    transform: rotate(0deg); 
  }
  25% { 
    transform: rotate(18deg); /* Inclinazione decisa da un lato */
  }
  50% { 
    transform: rotate(-6deg); /* Piccolo contro-bilanciamento */
  }
  75% { 
    transform: rotate(4deg); 
  }
  100% { 
    transform: rotate(0deg); 
  }
}

.group:hover .logo-head {
  animation: catHeadTilt 0.65s cubic-bezier(0.34, 1.56, 0.64, 1);
  /* Pivot posizionato sul collo/base della testa */
  transform-origin: bottom center; 
}
</style>