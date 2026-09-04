// Mapa de alcance — geometria real do Brasil (Natural Earth via world-atlas) +
// bolhas proporcionais posicionadas por lat/lon reais de cada estado.
(function () {
  // participação da audiência por estado (%)
  var UF = [
    { uf: 'MG', nome: 'Minas Gerais',      pct: 41.2, lat: -18.6, lon: -44.6 },
    { uf: 'SP', nome: 'São Paulo',         pct: 11.6, lat: -22.4, lon: -48.6 },
    { uf: 'BA', nome: 'Bahia',             pct: 6.4,  lat: -12.5, lon: -41.7 },
    { uf: 'GO', nome: 'Goiás',             pct: 5.1,  lat: -15.9, lon: -49.8, side: 'left' },
    { uf: 'PE', nome: 'Pernambuco',        pct: 4.3,  lat: -8.4,  lon: -37.9 },
    { uf: 'CE', nome: 'Ceará',             pct: 3.8,  lat: -5.2,  lon: -39.6 },
    { uf: 'DF', nome: 'Distrito Federal',  pct: 3.2,  lat: -15.78, lon: -47.93, ldy: -20 },
    { uf: 'RJ', nome: 'Rio de Janeiro',    pct: 3.0,  lat: -22.3, lon: -42.7 },
    { uf: 'MT', nome: 'Mato Grosso',       pct: 2.6,  lat: -13.0, lon: -55.5 },
    { uf: 'PA', nome: 'Pará',              pct: 2.1,  lat: -4.5,  lon: -52.5 }
  ];
  var OUTROS = +(100 - UF.reduce(function (s, d) { return s + d.pct; }, 0)).toFixed(1);
  var SEDE = { nome: 'São Gotardo', lat: -19.31, lon: -46.05 };

  function buildList() {
    var host = document.querySelector('.slide-map .uf-list');
    if (!host) return;
    var max = UF[0].pct;
    var rows = UF.slice(0, 6).map(function (d) {
      return '<div class="uf-row">' +
        '<span class="uf-code">' + d.uf + '</span>' +
        '<span class="uf-name">' + d.nome + '</span>' +
        '<span class="uf-bar"><i style="width:' + (d.pct / max * 100).toFixed(1) + '%"></i></span>' +
        '<span class="uf-pct">' + d.pct.toFixed(1) + '%</span>' +
        '</div>';
    }).join('');
    rows += '<div class="uf-row uf-rest">' +
      '<span class="uf-code">··</span>' +
      '<span class="uf-name">Demais estados</span>' +
      '<span class="uf-bar"><i style="width:' + (OUTROS / max * 100).toFixed(1) + '%"></i></span>' +
      '<span class="uf-pct">' + OUTROS.toFixed(1) + '%</span>' +
      '</div>';
    host.innerHTML = rows;
  }

  function fail(msg) {
    var host = document.getElementById('brazil-map');
    if (host) host.innerHTML = '<div class="map-fallback">' + msg + '</div>';
  }

  function draw(topology) {
    var host = document.getElementById('brazil-map');
    if (!host || !window.d3 || !window.topojson) return fail('Mapa indisponível offline');

    var W = host.clientWidth || 860;
    var H = host.clientHeight || 780;

    var countries = topojson.feature(topology, topology.objects.countries);
    var brazil = countries.features.filter(function (f) {
      return f.id === '076' || (f.properties && f.properties.name === 'Brazil');
    })[0];
    if (!brazil) return fail('Geometria não encontrada');

    var neighbours = countries.features.filter(function (f) { return f !== brazil; });

    var projection = d3.geoMercator().fitSize([W, H], brazil);
    var path = d3.geoPath(projection);

    var svg = d3.select(host).html('').append('svg')
      .attr('viewBox', '0 0 ' + W + ' ' + H)
      .attr('width', '100%').attr('height', '100%');

    var defs = svg.append('defs');
    var glow = defs.append('filter').attr('id', 'bm-glow')
      .attr('x', '-60%').attr('y', '-60%').attr('width', '220%').attr('height', '220%');
    glow.append('feGaussianBlur').attr('stdDeviation', '7').attr('result', 'b');
    var merge = glow.append('feMerge');
    merge.append('feMergeNode').attr('in', 'b');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');

    // países vizinhos, bem discretos, dão contexto geográfico
    svg.append('g').attr('class', 'bm-neighbours')
      .selectAll('path').data(neighbours).join('path')
      .attr('d', path);

    svg.append('g').attr('class', 'bm-country')
      .append('path').attr('d', path(brazil));

    // bolhas proporcionais (área ∝ participação)
    var r = d3.scaleSqrt().domain([0, UF[0].pct]).range([0, 38]);
    var g = svg.append('g').attr('class', 'bm-bubbles');

    var nodes = g.selectAll('g').data(UF).join('g')
      .attr('transform', function (d) {
        var p = projection([d.lon, d.lat]);
        return 'translate(' + p[0] + ',' + p[1] + ')';
      });

    nodes.append('circle').attr('class', 'bm-halo').attr('r', function (d) { return r(d.pct) + 5; });
    nodes.append('circle').attr('class', 'bm-dot').attr('r', function (d) { return r(d.pct); });

    function inside(d) { return r(d.pct) >= 22; }
    function lx(d) {
      if (inside(d)) return 0;
      return (d.side === 'left' ? -(r(d.pct) + 8) : r(d.pct) + 8);
    }
    function anchor(d) { return inside(d) ? 'middle' : (d.side === 'left' ? 'end' : 'start'); }

    nodes.append('text').attr('class', 'bm-label')
      .attr('x', lx)
      .attr('y', function (d) { return (inside(d) ? 5 : 4) + (d.ldy || 0); })
      .attr('text-anchor', anchor)
      .text(function (d) { return d.uf; });

    nodes.append('text').attr('class', 'bm-pct')
      .attr('x', lx)
      .attr('y', function (d) { return (inside(d) ? 22 : 19) + (d.ldy || 0); })
      .attr('text-anchor', anchor)
      .text(function (d) { return d.pct.toFixed(1) + '%'; });

    // sede do clube
    var sp = projection([SEDE.lon, SEDE.lat]);
    var sede = svg.append('g').attr('class', 'bm-sede')
      .attr('transform', 'translate(' + sp[0] + ',' + sp[1] + ')');
    sede.append('circle').attr('class', 'bm-sede-ring').attr('r', 13);
    sede.append('circle').attr('class', 'bm-sede-dot').attr('r', 4).attr('filter', 'url(#bm-glow)');
    sede.append('line').attr('class', 'bm-sede-lead')
      .attr('x1', -10).attr('y1', -6).attr('x2', -62).attr('y2', -26);
    sede.append('text').attr('class', 'bm-sede-txt').attr('x', -68).attr('y', -22)
      .attr('text-anchor', 'end').text('SÃO GOTARDO');
  }

  function init() {
    buildList();
    if (!window.d3 || !window.topojson) return fail('Mapa indisponível offline');
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json')
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(draw)
      .catch(function () { fail('Mapa indisponível offline'); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
