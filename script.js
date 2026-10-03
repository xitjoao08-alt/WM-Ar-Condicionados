(function () {
  'use strict';
  var NUMERO = '5517997524183';

  function linkWhats(texto) {
    return 'https://wa.me/' + NUMERO + '?text=' + encodeURIComponent(texto);
  }

  // Ano atual no rodapé
  document.getElementById('ano').textContent = new Date().getFullYear();

  // Cabeçalho muda ao rolar
  var header = document.querySelector('.header');
  function onScroll() { header.classList.toggle('solid', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menu mobile
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  function setMenu(aberto) {
    menu.classList.toggle('open', aberto);
    burger.setAttribute('aria-expanded', String(aberto));
    burger.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); burger.focus(); }
  });

  // Botões de WhatsApp (data-wa)
  document.querySelectorAll('[data-wa]').forEach(function (el) {
    var servico = el.getAttribute('data-wa');
    var msg = servico
      ? 'Olá! Gostaria de solicitar um orçamento de "' + servico + '" com a WM Ar Condicionados.'
      : 'Olá! Gostaria de solicitar um orçamento com a WM Ar Condicionados.';
    el.href = linkWhats(msg);
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });

  // Formulário
  var form = document.getElementById('form');
  var erro = document.getElementById('erro');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = form.elements;
    var obrigatorios = [d.nome, d.telefone, d.servico, d.local];
    var vazios = obrigatorios.filter(function (c) {
      var vazio = !c.value.trim();
      c.classList.toggle('invalid', vazio);
      return vazio;
    });
    var digitos = d.telefone.value.replace(/\D/g, '');
    if (vazios.length) {
      erro.textContent = 'Preencha os campos obrigatórios (*).';
      vazios[0].focus();
      return;
    }
    if (digitos.length < 10 || digitos.length > 13) {
      erro.textContent = 'Informe um telefone válido com DDD.';
      d.telefone.classList.add('invalid');
      d.telefone.focus();
      return;
    }
    erro.textContent = '';
    var msg = 'Olá! Gostaria de solicitar um orçamento com a WM Ar Condicionados.\n\n' +
      'Nome: ' + d.nome.value.trim() + '\n' +
      'Telefone: ' + d.telefone.value.trim() + '\n' +
      'Serviço: ' + d.servico.value + '\n' +
      'Localização: ' + d.local.value.trim() + '\n' +
      'Descrição: ' + (d.descricao.value.trim() || 'Não informada');
    var janela = window.open(linkWhats(msg), '_blank', 'noopener');
    if (!janela) window.location.href = linkWhats(msg);
  });
  form.addEventListener('input', function (e) { e.target.classList.remove('invalid'); });

  // Animação de entrada discreta
  var itens = document.querySelectorAll('.card, .diffs li, .about > *, form');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    itens.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }
})();
