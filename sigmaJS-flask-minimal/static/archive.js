const inputFile = document.getElementById('formFile');

// Adicione um ouvinte de evento para o evento de alteração do arquivo
inputFile.addEventListener('change', handleFileUpload);

// Função para lidar com o envio do arquivo
function handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    // Defina a função de retorno de chamada quando a leitura do arquivo for concluída
    reader.onload = function (e) {
      const fileContent = e.target.result;
  
      // Chame a função Python para processar o arquivo
      const processedData = processFileInPython(fileContent);
  
      // Converta o resultado para JSON
      const jsonData = JSON.stringify(processedData);
  
      // Envie o JSON para o Flask
      sendJSONToFlask(jsonData);
    };
  
    // Leia o conteúdo do arquivo como texto
    reader.readAsText(file);
  }
  
  // Função para chamar o código Python para processar o arquivo
  function processFileInPython(fileContent) {
    // Aqui você pode usar uma biblioteca como o Brython (Python em JavaScript)
    // ou enviar uma solicitação para o servidor executar um script Python separado
  
    // Exemplo de código usando o Brython (assumindo que você o incluiu no seu projeto)
    const pythonCode = `
      # Seu código Python para processar o arquivo
      # ...
    `;
  
    // Execute o código Python usando o Brython
    brython(1); // Inicialize o Brython
    const processedData = __BRYTHON__.py2js(pythonCode, '__main__', '__main__').to_js();
    eval(processedData);
  
    // Retorna o resultado do processamento em Python
    return processedData;
  }
  
  // Função para enviar o JSON para o Flask (via AJAX ou outra técnica)
  function sendJSONToFlask(jsonData) {
    // Aqui você pode usar AJAX ou outra técnica para enviar o JSON para o Flask
    // Você pode usar a biblioteca Axios, por exemplo:
    axios.post('/upload', { jsonData })
      .then(function (response) {
        // Manipule a resposta do Flask, se necessário
        console.log(response.data);
      })
      .catch(function (error) {
        // Lide com erros, se houver
        console.error(error);
      });
  }
  