const container = document.getElementById('sigma-container');
const connectionsInfo = document.getElementById('connections-info');
const searchInput = document.getElementById("search-input");
const searchSuggestions = document.getElementById("suggestions");

const response = fetch(STATIC_ROOT+'/graphs/RedeFiliacaoColoridoComunidades.json').then(response => {
  response.json().then(serializedGraph => {
    const graph = new graphology.Graph();
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

    renderer.setSetting("edgeReducer", (edge, data) => {
      return data;
    });


  const searchInput = document.getElementById('search-input');
  const searchSuggestions = document.getElementById('suggestions');

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

  });
});
