var btnExpandir = document.querySelector('#btn-expandir');
var menuLateral = document.querySelector('.menu-lateral');

btnExpandir.addEventListener('click',function(){
    menuLateral.classList.toggle('expandir');
})
