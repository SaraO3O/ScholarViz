#Converte igraph para json no formato simajs
class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)

def ig_to_json(graph, path):
    assert isinstance(graph, ig.Graph)
    nodes = []
    edges = []

    if not 'layout' in graph.attributes():
        graph['layout'] = graph.layout_auto()

    for v, coords in zip(graph.vs, graph['layout']):
        v_id = str(v.index)
        v_attributes = v.attributes()
        v_label = v_attributes.pop('label', None)
        if not v_label:
            v_label = v_id
        v_size = v_attributes.pop('size', None)
        if v_size:
            v_size = float(v_size)
        v_x = coords[0]
        v_y = coords[1]
        node = dict(key=v_id, attributes={**v_attributes,
            **dict(label=v_label, size=v_size, x=v_x, y=v_y)})
        nodes.append(node)

    for e in graph.es:
        e_id = str(e.index)
        e_source = str(e.source)
        e_target = str(e.target)
        e_attributes = e.attributes()
        e_size = e_attributes.pop('size', None)
        if e_size:
            e_size = float(e_size)
        edge = dict(key=e_id, source=e_source, target=e_target, attributes={**e_attributes,
            **dict(size=e_size)})
        edges.append(edge)

    data = dict(nodes=nodes, edges=edges)
    with open(path, 'w') as f:
        json.dump(data, f, ensure_ascii=False, cls=NpEncoder)
    return os.path.exists(path)


// --------------------------------------------------------------------
#conversao de igraph para sigmajs com grafo direcionado -- teste
class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)

def ig_to_json(graph, path):
    assert isinstance(graph, ig.Graph)
    nodes = []
    edges = []

    if not 'layout' in graph.attributes():
        graph['layout'] = graph.layout_auto()

    for v, coords in zip(graph.vs, graph['layout']):
        v_id = str(v.index)
        v_attributes = v.attributes()
        v_label = v_attributes.pop('label', None)
        if not v_label:
            v_label = v_id
        v_size = v_attributes.pop('size', None)
        if v_size:
            v_size = float(v_size)
        v_x = coords[0]
        v_y = coords[1]
        node = dict(key=v_id, attributes={**v_attributes,
            **dict(label=v_label, size=v_size, x=v_x, y=v_y)})
        nodes.append(node)

    for e in graph.es:
        e_id = str(e.index)
        e_source = str(e.source)
        e_target = str(e.target)
        e_attributes = e.attributes()
        e_size = e_attributes.pop('size', None)
        if e_size:
            e_size = float(e_size)
        
        # Verifica se o grafo é direcionado
        if graph.is_directed():
            edge_type = 'arrow'  # Indica uma aresta direcionada
        else:
            edge_type = 'line'   # Indica uma aresta não direcionada
        
        edge = dict(key=e_id, source=e_source, target=e_target, attributes={**e_attributes,
            **dict(size=e_size, type=edge_type)})
        edges.append(edge)

    data = dict(nodes=nodes, edges=edges)
    with open(path, 'w') as f:
        json.dump(data, f, ensure_ascii=False, cls=NpEncoder)
    return os.path.exists(path)

// ----------------------------------------------

#Converte igraph para json no formato simajs --> sem verificar direcionamento
class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)

def ig_to_json(graph, path):
    assert isinstance(graph, ig.Graph)
    nodes = []
    edges = []

    if not 'layout' in graph.attributes():
        graph['layout'] = graph.layout_auto()

    for v, coords in zip(graph.vs, graph['layout']):
        v_id = str(v.index)
        v_attributes = v.attributes()
        v_label = v_attributes.pop('label', None)
        if not v_label:
            v_label = v_id
        v_size = v_attributes.pop('size', None)
        if v_size:
            v_size = float(v_size)
        v_x = coords[0]
        v_y = coords[1]
        node = dict(key=v_id, attributes={**v_attributes,
            **dict(label=v_label, size=v_size, x=v_x, y=v_y)})
        nodes.append(node)

    for e in graph.es:
        e_id = str(e.index)
        e_source = str(e.source)
        e_target = str(e.target)
        e_attributes = e.attributes()
        e_size = e_attributes.pop('size', None)
        if e_size:
            e_size = float(e_size)
        edge = dict(key=e_id, source=e_source, target=e_target, attributes={**e_attributes,
            **dict(size=e_size)})
        edges.append(edge)

    data = dict(nodes=nodes, edges=edges)
    with open(path, 'w') as f:
        json.dump(data, f, ensure_ascii=False, cls=NpEncoder)
    return os.path.exists(path)

// --------------------------------------------------------------
# Obtém o caminho absoluto do diretório atual
current_dir = os.getcwd()

# Constrói o caminho completo para o arquivo JSON
json_path = os.path.join(current_dir, 'CitacaoBetweennessTeste.json')

# Chama a função ig_to_json passando o caminho completo
ig_to_json(gCitacao, json_path)