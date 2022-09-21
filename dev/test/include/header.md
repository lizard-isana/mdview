[test](./){.header_title}

- [home](/)
- [main](main.md)
- [sub](sub.md)

<style>
  header > mdview-content > section{
    max-width:initial;
    width:100%;
    padding:10px;
  }
  .header_title{
    font-family: "Noto Sans JP", sans-serif;
    font-weight: 100;
    font-size:18px;
    text-decoration:none;
  }
</style>

<div class="hamburger"><span></span><span></span><span></span><span></span></div>
<script>
  const hamburger = document.querySelector(".hamburger");
  hamburger.addEventListener('click',(e)=>{
    var hamburger = e.currentTarget;
    var section = hamburger.closest('section');
    section.classList.toggle("open")
  })
  const link = document.querySelectorAll("header ul li a");
  link.forEach((element,index)=>{
    element.addEventListener('click',(e)=>{
      var section = e.currentTarget.closest('section');
      section.classList.toggle("open");
    })
  })
</script>
<style>
  .hamburger{
    position: relative;
    width: 57px;
    height: 44px;
    top: 26px;
    right: 22px;
    z-index: 1000;
    cursor: pointer;
  }
  .hamburger>span{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 38px;
    height: 1px;
    background: #666;
    -webkit-transition: 200ms ease-in-out;
    transition: 200ms ease-in-out;
  }
  .hamburger>span:nth-child(1) {
    top: 10px;
  }
  .hamburger>span:nth-child(2) {
    top: 20px;
  }
  .hamburger>span:nth-child(3) {
    top: 20px;
  }
  .hamburger>span:nth-child(4) {
    top: 30px;
  }
  header {
    position:relative;
  }
  .hamburger{
    position:absolute;
    right:10px;
    top:10px;
  }
  header section.open .hamburger>span:nth-child(1) {
    transform: translateY(-6px);
    opacity: 0;
  }
  header section.open .hamburger>span:nth-child(2) {
    transform: rotate(-45deg);
  }
  header section.open .hamburger>span:nth-child(3) {
    transform: rotate(45deg);
  }
  header section.open .hamburger>span:nth-child(4) {
    transform: translateY(6px);
    opacity: 0;
  }
  header section ul{
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    position: absolute;
    margin: 0;
    padding-top: 60px;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color:#bbb;
    opacity:0;
    -webkit-transition: 200ms ease-in-out;
    transition: 200ms ease-in-out;
    backdrop-filter: blur(12px);
  }
  header section ul li{
    grid-column:1/2;
    grid-row:1/2;
    width:fit-content;
    align-self:center;
  }
  header section.open ul{
    opacity:0.85;
  }
</style>