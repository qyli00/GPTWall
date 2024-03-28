import seedrandom from "seedrandom";

const DEFAULT_PARAMS = {
    "model": "gpt-3.5-turbo",
    "temperature": 0.0
}

const apiKey = "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";
const epsilon = 1.0, sensitivity = 1.0, topK = 3, threshold = 0.8, maxFakeNum = 10;

const snowball = (triplets, posExamples, negExamples, policy) => {
  var paramterList = [];
  if (posExamples.length == 0) return [];
  if (policy == undefined) {
    const posType = Array.from(new Set(posExamples.map(x => {
      let node = triplets.find(triple => triple.title === x.prompt).graph.nodes.find(nd => nd.id.includes(x.id) || x.id.includes(nd.id));
      if (node !== undefined) return node.type;
    }
    ))).filter(x => x);
    const negType = Array.from(new Set(negExamples.map(x => {
      let node = triplets.find(triple => triple.title === x.prompt).graph.nodes.find(nd => nd.id.includes(x.id) || x.id.includes(nd.id));
      if (node !== undefined) return node.type;
    }
    ))).filter(x => x);
    if (posType.length > 0)
      paramterList.push([{type: 'type', label: posType[0], data: [...posType.map(type => ({label: 'pos', val: type}))]},
      {type: 'label_neg', label: 'Allowlist', data: [ ...negExamples.map(neg => ({val: neg.id}))]}]);
      paramterList.push([{type: 'label_pos', label: 'Denylist', data: [...posExamples.map(pos => ({val: pos.id}))]}]);
  }
  else {
  //   const posType = Array.from(new Set(posExamples.map(x => {
  //     let node = triplets.find(triple => triple.title === x.prompt).graph.nodes.find(nd => nd.id.includes(x.id) || x.id.includes(nd.id));
  //     if (node !== undefined) return node.type;
  //   }
  //   )));
  //   const negType = Array.from(new Set(negExamples.map(x => {
  //     let node = triplets.find(triple => triple.title === x.prompt).graph.nodes.find(nd => nd.id.includes(x.id) || x.id.includes(nd.id));
  //     if (node !== undefined) return node.type;
  //   }
  //   )));
  //   paramterList = [[{type: 'type', label: 'type', data: [...posType.map(type => ({label: 'pos', val: type}))]}],
  //                   [{type: 'label', label: 'label', data: [...posExamples.map(pos => ({label: 'pos', val: pos.id})), 
  //                                                             ...negExamples.map(neg => ({label: 'neg', val: neg.id}))]}]];
  }
  return paramterList;
};

async function generateText(originText, changeList) {
    const prompt = await fetch('prompts/generateText.prompt')
                    .then(response => response.text())
                    .then(text => text.replace("$paragraph", originText))
                    .then(text => text.replace("$changes", changeList.map(change => {
                        if (change.type === 'update')
                        return `change ${change.id} to ${change.value}`;
                        else if (change.type === 'remove') 
                        return 'delete all the information related to ' + change.id;
                        return '';
                    }).join(', ')));
    
    const params = { ...DEFAULT_PARAMS, messages: [{role: 'user', content: prompt}], "temperature": 1.0};
    const requestOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(apiKey)
    },
    body: JSON.stringify(params)
    };
    return await fetch('https://api.openai.com/v1/chat/completions', requestOptions)
                .then(response => {
                if (!response.ok) {
                    switch (response.status) {
                    case 401: // 401: Unauthorized: API key is wrong
                        throw new Error('Please double-check your API key.');
                    case 429: // 429: Too Many Requests: Need to pay
                        throw new Error('You exceeded your current quota, please check your plan and billing details.');
                    default:
                        throw new Error('Something went wrong with the request, please check the Network log');
                    }
                }
                return response.json();
                })
                .then((response) => {
                const { choices } = response;
                const text = choices[0].message.content;
                
                return text.trim();
                }).catch((error) => {
                console.log(error);
                alert(error);
                });
}

async function revise(paragraph) {

    const prompt = await fetch('prompts/revise.prompt')
    .then(response => response.text())
    .then(text => text.replace("$paragraph", paragraph));
    
    console.log(prompt);
    const params = { ...DEFAULT_PARAMS, messages: [{role: 'user', content: prompt}], "temperature": 1.0};
    const requestOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(apiKey)
    },
    body: JSON.stringify(params)
    };
    return await fetch('https://api.openai.com/v1/chat/completions', requestOptions)
                .then(response => {
                if (!response.ok) {
                    switch (response.status) {
                    case 401: // 401: Unauthorized: API key is wrong
                        throw new Error('Please double-check your API key.');
                    case 429: // 429: Too Many Requests: Need to pay
                        throw new Error('You exceeded your current quota, please check your plan and billing details.');
                    default:
                        throw new Error('Something went wrong with the request, please check the Network log');
                    }
                }
                return response.json();
                })
                .then((response) => {
                const { choices } = response;
                const text = choices[0].message.content;

                document.body.style.cursor = 'default';

                if (text.includes('Yes')) {
                    if (text.includes('paragraph:')) return text.split('paragraph:').pop().trim();
                    return text.split('Paragraph:').pop().trim();
                }
                return paragraph;

                }).catch((error) => {
                console.log(error);
                alert(error);
                });
}

async function getOptions(originText, operator, id, label, type) {
    const extractOptionsAndScores = (text) => {
      const optionRegex = /(\w[\w\s]+)\s+\((\d+\.\d+)\)/g;
      const options = [];
      const scores = [];
    
      let match;
      while ((match = optionRegex.exec(text))) {
        options.push(match[1]);
        scores.push(parseFloat(match[2]));
      }
    
      return [options, scores];
    };
    
    async function getSpoofOptions(id, label) {
      const sentences = originText.split('.');
      var sentence;
      if (id.includes('--')) {
        const source = id.split('--')[0], target = id.split('--')[2];
        sentence = sentences.find(sentence => sentence.includes(label) && (sentence.includes(source) || sentence.includes(target)))
        if (sentence === undefined) return undefined;
        else sentence = sentence.trim().replace(label, `[A]`);;
      }
      else {
        sentence = sentences.find(sentence => sentence.includes(id));
        if (sentence === undefined) return undefined;
        else sentence = sentence.trim().replace(id, `[A: ${label}]`);
      }
      
      const prompt = await fetch('prompts/spoof.prompt')
                        .then(response => response.text())
                        .then(text => text.replace("$sentence", sentence));

      console.log(prompt);
      const params = { ...DEFAULT_PARAMS, messages: [{role: 'user', content: prompt}]};
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(apiKey)
        },
        body: JSON.stringify(params)
      };

      const result = await fetch('https://api.openai.com/v1/chat/completions', requestOptions)
                  .then(response => {
                    if (!response.ok) {
                      switch (response.status) {
                        case 401: // 401: Unauthorized: API key is wrong
                          throw new Error('Please double-check your API key.');
                        case 429: // 429: Too Many Requests: Need to pay
                          throw new Error('You exceeded your current quota, please check your plan and billing details.');
                        default:
                          throw new Error('Something went wrong with the request, please check the Network log');
                      }
                    }
                    return response.json();
                  })
                  .then((response) => {
                    const { choices } = response;
                    const text = choices[0].message.content;
                    return extractOptionsAndScores(text);
                  }).catch((error) => {
                    console.log(error);
                    alert(error);
                  });

      return result;
    }

    async function getNoisifiedOptions(label) {
      const prompt = await fetch('prompts/noisify.prompt')
                            .then(response => response.text())
                            .then(text => text.replace("$word", label));
        
      console.log(prompt);
      const params = { ...DEFAULT_PARAMS, messages: [{role: 'user', content: prompt}]};
      const requestOptions = {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(apiKey)
          },
          body: JSON.stringify(params)
      };
      const result = await fetch('https://api.openai.com/v1/chat/completions', requestOptions)
                      .then(response => {
                      if (!response.ok) {
                          switch (response.status) {
                          case 401: // 401: Unauthorized: API key is wrong
                              throw new Error('Please double-check your API key.');
                          case 429: // 429: Too Many Requests: Need to pay
                              throw new Error('You exceeded your current quota, please check your plan and billing details.');
                          default:
                              throw new Error('Something went wrong with the request, please check the Network log');
                          }
                      }
                      return response.json();
                      })
                      .then((response) => {
                      const { choices } = response;
                      const text = choices[0].message.content;

                      return extractOptionsAndScores(text);

                      }).catch((error) => {
                      console.log(error);
                      alert(error);
                      });

      return result;
    }

    async function getFlipWords(label) {
      const prompt = await fetch('prompts/flip.prompt')
                          .then(response => response.text())
                          .then(text => text.replace("$word", label))
      console.log(prompt);
      const params = { ...DEFAULT_PARAMS, messages: [{role: 'user', content: prompt}]};
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(apiKey)
        },
        body: JSON.stringify(params)
      };
      const result = await fetch('https://api.openai.com/v1/chat/completions', requestOptions)
                  .then(response => {
                    if (!response.ok) {
                      switch (response.status) {
                        case 401: // 401: Unauthorized: API key is wrong
                          throw new Error('Please double-check your API key.');
                        case 429: // 429: Too Many Requests: Need to pay
                          throw new Error('You exceeded your current quota, please check your plan and billing details.');
                        default:
                          throw new Error('Something went wrong with the request, please check the Network log');
                      }
                    }
                    return response.json();
                  })
                  .then((response) => {
                    const { choices } = response;
                    const text = choices[0].message.content;

                    return extractOptionsAndScores(text);

                  }).catch((error) => {
                    console.log(error);
                    alert(error);
                  });

      return result;
    }

    if (operator === 'spoof') return await getSpoofOptions(id, id.includes('--') ? label : type);
    else if (operator === 'flip') return await getFlipWords(label);
    else if (operator === 'noisify') return await getNoisifiedOptions(label);
    return undefined;
  };

  const Watermarking = (options, userId) => {
    var rng = seedrandom(userId + ':' + options.join('|'));
    let argsort = array => array.map((v, i) => [v, i]).sort().map(p => p[1]);
    
    const values = options.map(() => rng());
    const index = argsort(values).slice(0, topK);
    return index;
  };

  const Sample = (options, scores) => {
    const probability = scores.map(score => Math.exp(epsilon * score / (2 * sensitivity)));
    let p = probability.reduce((a, e) => a + e) * Math.random();
    const idx = Array.from(Array(options.length).keys()).find((e, i) => (p -= probability[i]) <= 0);
    return options[idx];
  }

  async function getValue(UUID, text, operator, id, label, type) {
    const laplace = (mu, b) => {
      var U = Math.random() - 0.5;
      return mu - (b * Math.sign(U) * Math.log(1 - 2 * Math.abs(U)));    
    };

    const privatize = (F, deltaF, epsilon) => (F + laplace(0.0, deltaF/epsilon));
    const getNoisifiedResult = (text, value) => {
      const val = parseFloat(value), range=50;
      const newValue = val + laplace(0, range/100 * val);
      return text.replace(value, newValue.toFixed(value.includes('.') ? value.split('.')[1].length : 0));
    };

    var value = label.match(/(\d[\d\.]*)/);
    if (value !== null && operator === "noisify") 
      return getNoisifiedResult(label, value[0]);

    const [options, scores] = await getOptions(text, operator, id, label, type);
    const index = Watermarking(options, UUID);
    const watermarkOptions = index.map(i => options[i]), watermarkScores = index.map(i => scores[i]);
    watermarkOptions.unshift(label); 
    watermarkScores.unshift(privatize(0.5, 1.0, epsilon));
    return Sample(watermarkOptions, watermarkScores);
  }

  export { generateText, revise, getOptions, getValue, snowball };