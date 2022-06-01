//Definições de variaveis
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var imageData1;
var imageData2;
var result;

//Tirando a imagem1 do input
document.getElementById("firstImage").onchange = function (evt) {
  var tgt = evt.target || window.event.srcElement,
    files = tgt.files;
  if (FileReader && files && files.length) {
    var fr = new FileReader();
    fr.onload = () => showImage1(fr);
    fr.readAsDataURL(files[0]);
  }
};

//Tirando a imagem2 do input
document.getElementById("secondImage").onchange = function (evt) {
  var tgt = evt.target || window.event.srcElement,
    files = tgt.files;
  if (FileReader && files && files.length) {
    var fr = new FileReader();
    fr.onload = () => showImage2(fr);
    fr.readAsDataURL(files[0]);
  }
};

//lendo e mostrando a imagem1
function showImage1(fileReader) {
  var img = document.getElementById("image1");
  img.src = fileReader.result;
}

//lendo e mostrando a imagem2
function showImage2(fileReader) {
  var img = document.getElementById("image2");
  img.src = fileReader.result;
}

//Mapeando a imagem em 255pixels
const adjustOverFlow = (img) =>
  img.map((pixel) => (pixel > 255 ? pixel % 255 : pixel));

function showImageResult(img) {
  const wrapper = document.createElement("div");
  const label = document.createElement("p");

  wrapper.appendChild(label);
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  const typedArray = new Uint8ClampedArray(img.length);

  for (let i = 0; i < img.length - 4; i += 4) {
    typedArray[i] = img[i];
    typedArray[i + 1] = img[i + 1];
    typedArray[i + 2] = img[i + 2];
    typedArray[i + 3] = 255;
  }

  const imgData = new ImageData(typedArray, 512, 512);
  context.putImageData(imgData, 0, 0);

  wrapper.appendChild(canvas);
  document.getElementById("canvas-wrapper").appendChild(wrapper);
}

const adjustUnderFlow = (img) => img.map((pixel) => (pixel < 0 ? 0 : pixel));

//definindo as funções
var func_adicao = false;
var func_subtracao = false;
var mult = false;
var func_div = false;
var func_media = false;
var blend = false;
var func_andd = false;
var func_orr = false;
var func_xorr = false;
var nott1 = false;
var nott2 = false;

//definindo as funções
function operation(op) {
  op == "func_adicao" ? (func_adicao = true) : (func_adicao = false);
  op == "func_subtracao" ? (func_subtracao = true) : (func_subtracao = false);
  op == "mult" ? (mult = true) : (mult = false);
  op == "func_div" ? (func_div = true) : (func_div = false);
  op == "func_media" ? (func_media = true) : (func_media = false);
  op == "blend" ? (blend = true) : (blend = false);
  op == "func_and" ? (func_andd = true) : (func_andd = false);
  op == "func_or" ? (func_orr = true) : (func_orr = false);
  op == "func_xor" ? (func_xorr = true) : (func_xorr = false);
  op == "not1" ? (nott1 = true) : (nott1 = false);
  op == "not2" ? (nott2 = true) : (nott2 = false);
}

//Pega as imagens
async function sendImage() {
  const [archive1, archive2] = await Promise.all([
    getImageData("firstImage", "image1"),
    getImageData("secondImage", "image2"),
  ]);

  // se for multiplicação, chama a função referente, assim com os demais
  if (mult) {
    const multiplicationResult = multiply(archive1, archive2);
    showImageResult(multiplicationResult);
  }

  //Divisão
  if (func_div) {
    const divisionResult = divide(archive1, archive2);
    showImageResult(divisionResult);
  }

  //Adição
  if (func_adicao) {
    const somaResult = sum(archive1, archive2);
    showImageResult(somaResult);
  }

  //Subtração
  if (func_subtracao) {
    const subtractionResult = subtract(archive1, archive2);
    showImageResult(subtractionResult);
  }

  //Média
  if (func_media) {
    const mediaResult = mediaa(archive1, archive2);
    showImageResult(mediaResult);
  }

  //Blend
  if (blend) {
    const mediaResult = blending(archive1, archive2);
    showImageResult(mediaResult);
  }

  //Or
  if (func_orr) {
    const resultOR = or(archive1, archive2);
    showImageResult(resultOR);
  }

  //And
  if (func_andd) {
    const resultAND = and(archive1, archive2);
    showImageResult(resultAND);
  }

  //Xor
  if (func_xorr) {
    const resultXOR = xor(archive1, archive2);
    showImageResult(resultXOR);
  }

  //Not imagem1
  if (nott1) {
    const resultNOT = not(archive1, archive2);
    showImageResult(resultNOT);
  }

  //Not imagem2
  if (nott2) {
    const resultNOT = not2(archive1, archive2);
    showImageResult(resultNOT);

  }

  function getImageData(inputId, imgId) {
    return new Promise((resolve, reject) => {
      const input = document.getElementById(inputId);
      const img = document.getElementById(imgId);

      img.src = URL.createObjectURL(input.files[0]);
      console.log(input.files[0]);
      const imgObj = new Image();

      setTimeout(() => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 0);
        const data = context.getImageData(0, 0, 512, 512);

        return resolve(data.data);
      }, 200);
    });
  }

  // realiza a multiplicação
  function multiply(firstMatriz, secondMatriz) {
    const result = [];
    for (let i = 0; i < firstMatriz.length; i++) {
      result[i] = firstMatriz[i] * secondMatriz[i];
    }

    var num = $("#mult").val();
    for (let j = 0; j < result.length; j++) {
      result[j] = result[j] * parseFloat(num);
    }

    return adjustOverFlow(result);
  }

  // realiza o blend
  function blending(firstMatriz, secondMatriz) {
    const result = [];
    var num = $("#blend").val();
    for (let i = 0; i < firstMatriz.length; i++) {
      result[i] =
        parseFloat(num) * firstMatriz[i] +
        (1 - parseFloat(num)) * secondMatriz[i];
    }

    return adjustOverFlow(result);
  }

  // realiza a soma
  function sum(firstMatriz, secondMatriz) {
    const result = [];
    for (let i = 0; i < firstMatriz.length; i++) {
      result[i] = firstMatriz[i] + secondMatriz[i];
    }

    return adjustOverFlow(result);
  }

  // realiza a subtração
  function subtract(firstMatriz, secondMatriz) {
    const result = [];
    for (let i = 0; i < firstMatriz.length; i++) {
      result[i] = firstMatriz[i] - secondMatriz[i];
    }

    return adjustUnderFlow(result);
  }

  // realiza a divisão
  function divide(firstMatriz, secondMatriz) {
    const result = [];
    for (let i = 0; i < firstMatriz.length; i++) {
      result[i] = firstMatriz[i] / secondMatriz[i];
    }

    var num = $("#div").val();

    for (let j = 0; j < result.length; j++) {
      result[j] = result[j] * parseFloat(num);
    }

    return adjustUnderFlow(result);
  }

  // realiza a média
  function mediaa(firstMatriz, secondMatriz) {
    const result = [];
    for (let i = 0; i < firstMatriz.length; i++) {
      result[i] = (firstMatriz[i] + secondMatriz[i]) / 2;
    }

    return adjustOverFlow(result);
  }

  // realiza o OR
  function or(firstMatriz, secondMatriz) {
    const result = [];
    for (let i = 0; i < firstMatriz.length; i++) {
      result[i] = firstMatriz[i] | secondMatriz[i];
    }

    return adjustOverFlow(result);
  }

  // realiza o AND
  function and(firstMatriz, secondMatriz) {
    const result = [];
    for (let i = 0; i < firstMatriz.length; i++) {
      result[i] = firstMatriz[i] & secondMatriz[i];
    }

    return adjustOverFlow(result);
  }

  // realiza o XOR
  function xor(firstMatriz, secondMatriz) {
    const result = [];
    for (let i = 0; i < firstMatriz.length; i++) {
      result[i] = firstMatriz[i] ^ secondMatriz[i];
    }

    return adjustOverFlow(result);
  }

  // realiza o NOT da imagem 1
  function not(firstMatriz, secondMatriz) {
    const result = [];
    for (let i = 0; i < firstMatriz.length; i++) {
      result[i] = firstMatriz[i] != secondMatriz[i];
      result[i] = 255 - firstMatriz[i];
    }

    return adjustOverFlow(result);
  }

  // realiza o NOT da imagem 2
  function not2(firstMatriz, secondMatriz) {
    const result = [];
    for (let i = 0; i < firstMatriz.length; i++) {
      result[i] = firstMatriz[i] != secondMatriz[i];
      result[i] = 255 - secondMatriz[i];
    }

    return adjustOverFlow(result);

  }
}
