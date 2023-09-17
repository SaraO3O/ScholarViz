const container = document.getElementById('sigma-container');
const connectionsInfo = document.getElementById('connections-info');
const searchInput = document.getElementById("search-input");
const searchSuggestions = document.getElementById("suggestions");
let graph; 

function loadRedeCitacaoGrafo() {
  const graphPath = '/graphs/gCitacoes.json';
  loadAndRenderGraph(graphPath);
}

function loadRedeFiliacaoGrafo() {
  const graphPath = '/graphs/gFiliacao.json';
  loadAndRenderGraph(graphPath);
}

function loadRedeFiliacaoDegree() {
  const graphPath = '/graphs/gFiliacaoDegree.json';
  loadAndRenderGraph(graphPath);
}

function loadRedeFiliacaoBetweenness() {
  const graphPath = '/graphs/gFiliacaoBetweenness.json';
  loadAndRenderGraph(graphPath);
}

function loadAndRenderGraph(graphPath) {
  fetch(STATIC_ROOT + graphPath).then(response => response.json()).then(serializedGraph => {
    graph = new graphology.Graph();
    console.log("Loading json into graph...")
    graph.import(serializedGraph);
    container.innerHTML = "";

    const renderer = new Sigma(graph, container);
      
    // Redutores
    renderer.setSetting("nodeReducer", (node, data) => {
      const nodeDegree = graph.degree(node);
      const label = graph.getNodeAttribute(node, 'label');
      data.label = `${label} (${nodeDegree} conexões)`;
      return data;
    });

    // Exibição do vizinho do nó destacado
    let hoveredNode = null;
    renderer.on('enterNode', ({ node }) => {
      hoveredNode = node;
      renderer.setSetting("nodeReducer", (node, data) => {
        if (node === hoveredNode || graph.hasEdge(node, hoveredNode) || graph.hasEdge(hoveredNode, node)) {
          data.hidden = false;
        } else {
          data.hidden = true;
        }
        return data;
      });
      renderer.refresh();
      updateConnectionsInfo(hoveredNode);
    });

    renderer.on('leaveNode', () => {
      hoveredNode = null;
      renderer.setSetting("nodeReducer", (node, data) => {
        data.hidden = false; // Restaurar a exibição de todos os nós
        return data;
      });
      renderer.refresh();
    });

    // Redução de arestas
    renderer.setSetting("edgeReducer", (edge, data) => {
      const sourceNode = graph.source(edge);
      const targetNode = graph.target(edge);
      if (hoveredNode && (sourceNode !== hoveredNode && targetNode !== hoveredNode)) {
        data.hidden = true;
      }
      return data;
    });
  });
}

//Carregamento inicial
loadRedeCitacaoGrafo();

searchInput.addEventListener('input', () => {
  const query = searchInput.value;
  setSearchQuery(query);
  showSearchSuggestions(query);
});

function setSearchQuery(query) {
  renderer.setSetting("nodeReducer", (node, data) => {
    const label = graph.getNodeAttribute(node, 'label');
    if (label.toLowerCase().includes(query.toLowerCase())) {
      data.hidden = false;
    } else {
      data.hidden = true;
    }
    return data;
  });
  renderer.refresh();
}

function showSearchSuggestions(query) {
  const lcQuery = query.toLowerCase();
  const suggestions = graph
    .nodes()
    .map((n) => graph.getNodeAttribute(n, 'label'))
    .filter((label) => label.toLowerCase().includes(lcQuery));

  searchSuggestions.innerHTML = '';
  suggestions.forEach((label) => {
    const suggestionOption = document.createElement('option');
    suggestionOption.value = label;
    searchSuggestions.appendChild(suggestionOption);
  });
}

  // Atualizar as informações de conexões na div connections-info
  function updateConnectionsInfo(node) {
    connectionsInfo.innerHTML = '';
    if (node) {
      connectionsInfo.style.display = 'block'; // Exibe o connections-info
      const nodeDegree = graph.degree(node);
      const label = graph.getNodeAttribute(node, 'label');
      const nodeInfo = document.createElement('p');
      nodeInfo.innerText = `${label}: ${nodeDegree} conexões`;
      connectionsInfo.appendChild(nodeInfo);
    }
  }


document.getElementById("redeCitacao").addEventListener("click", function () {
  loadRedeCitacaoGrafo();
});

document.getElementById("redeFiliacao").addEventListener("click", function () {
  loadRedeFiliacaoGrafo();
});

document.getElementById("redeFiliacaoBetweenness").addEventListener("click", function () {
  loadRedeFiliacaoBetweenness();
});

document.getElementById("redeFiliacaoDegree").addEventListener("click", function () {
  loadRedeFiliacaoDegree();
});
