document.addEventListener('DOMContentLoaded', () => {
    const { jsPDF } = window.jspdf;
    const editor = document.getElementById('editor');
    const boldBtn = document.getElementById('boldBtn');
    const italicBtn = document.getElementById('italicBtn');
    const underlineBtn = document.getElementById('underlineBtn');
    const highlightBtn = document.getElementById('highlightBtn');
    const colorBtn = document.getElementById('colorBtn');
    const fontSize = document.getElementById('fontSize');
    const fontFamily = document.getElementById('fontFamily');
    const alignLeftBtn = document.getElementById('alignLeftBtn');
    const alignCenterBtn = document.getElementById('alignCenterBtn');
    const alignRightBtn = document.getElementById('alignRightBtn');
    const linkBtn = document.getElementById('linkBtn');
    const videoBtn = document.getElementById('videoBtn');
    const tableBtn = document.getElementById('tableBtn');
    const textboxBtn = document.getElementById('textboxBtn');
    const imageBtn = document.getElementById('imageBtn');
    const loadPDFBtn = document.getElementById('loadPDFBtn');
    const chartBtn = document.getElementById('chartBtn');
    const stickyNoteBtn = document.getElementById('stickyNoteBtn');
    const drawBtn = document.getElementById('drawBtn');
    const templateSelect = document.getElementById('templateSelect');
    const searchReplaceBtn = document.getElementById('searchReplaceBtn');
    const printPreviewBtn = document.getElementById('printPreviewBtn');
    const pageSize = document.getElementById('pageSize');
    const exportSelectionBtn = document.getElementById('exportSelectionBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const shareBtn = document.getElementById('shareBtn');
    const imageInput = document.getElementById('imageInput');
    const pdfInput = document.getElementById('pdfInput');
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const versionHistoryBtn = document.getElementById('versionHistoryBtn');
    const shapeBtn = document.getElementById('shapeBtn');
    const themeBtn = document.getElementById('themeBtn');
    const orderedListBtn = document.getElementById('orderedListBtn');
    const unorderedListBtn = document.getElementById('unorderedListBtn');

    if (!editor || !boldBtn || !italicBtn || !underlineBtn || !highlightBtn || !colorBtn ||
        !fontSize || !fontFamily || !alignLeftBtn || !alignCenterBtn || !alignRightBtn ||
        !linkBtn || !videoBtn || !tableBtn || !textboxBtn || !imageBtn || !loadPDFBtn ||
        !chartBtn || !stickyNoteBtn || !drawBtn || !templateSelect || !searchReplaceBtn ||
        !printPreviewBtn || !pageSize || !exportSelectionBtn || !downloadBtn || !shareBtn ||
        !imageInput || !pdfInput || !undoBtn || !redoBtn || !versionHistoryBtn || !shapeBtn ||
        !themeBtn || !orderedListBtn || !unorderedListBtn) {
        console.error('Um ou mais elementos do DOM não foram encontrados.');
        return;
    }

    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

    let versionHistory = [];
    let currentVersion = -1;

    function saveVersion() {
        versionHistory = versionHistory.slice(0, currentVersion + 1);
        versionHistory.push(editor.innerHTML);
        currentVersion++;
        if (versionHistory.length > 20) {
            versionHistory.shift();
            currentVersion--;
        }
    }

    boldBtn.onclick = () => document.execCommand('bold', false, null);
    italicBtn.onclick = () => document.execCommand('italic', false, null);
    underlineBtn.onclick = () => document.execCommand('underline', false, null);
    highlightBtn.onclick = () => document.execCommand('backColor', false, '#00FF08A1');
    colorBtn.onclick = () => {
        const color = prompt('Digite uma cor (ex: red, #ff0000):');
        if (color) document.execCommand('foreColor', false, color);
    };
    fontSize.onchange = () => document.execCommand('fontSize', false, fontSize.value / 4);
    fontFamily.onchange = () => document.execCommand('fontName', false, fontFamily.value);
    alignLeftBtn.onclick = () => document.execCommand('justifyLeft', false, null);
    alignCenterBtn.onclick = () => document.execCommand('justifyCenter', false, null);
    alignRightBtn.onclick = () => document.execCommand('justifyRight', false, null);
    linkBtn.onclick = () => {
        const url = prompt('Digite o URL:');
        if (url) document.execCommand('createLink', false, url);
    };
    orderedListBtn.onclick = () => document.execCommand('insertOrderedList', false, null);
    unorderedListBtn.onclick = () => document.execCommand('insertUnorderedList', false, null);

    videoBtn.onclick = () => {
        const url = prompt('Digite o URL do vídeo (ex: YouTube):');
        if (url) {
            let videoUrl = url;
            const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
            const youtubeMatch = url.match(youtubeRegex);
            if (youtubeMatch) {
                videoUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
            }

            const videoContainer = document.createElement('div');
            videoContainer.className = 'video-preview draggable resizable';
            const iframe = document.createElement('iframe');
            iframe.src = videoUrl;
            iframe.width = '560';
            iframe.height = '315';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.style.maxWidth = '100%';
            videoContainer.appendChild(iframe);
            videoContainer.dataset.url = url;
            editor.appendChild(videoContainer);
            saveVersion();
        }
    };

    tableBtn.onclick = () => {
        const rows = prompt('Número de linhas:');
        const cols = prompt('Número de colunas:');
        if (rows && cols) {
            const table = document.createElement('table');
            table.className = 'draggable';
            for (let i = 0; i < rows; i++) {
                const tr = document.createElement('tr');
                for (let j = 0; j < cols; j++) {
                    const td = document.createElement('td');
                    td.contentEditable = true;
                    td.textContent = ' ';
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
            editor.appendChild(table);
            saveVersion();
        }
    };

    textboxBtn.onclick = () => {
        const textbox = document.createElement('div');
        textbox.className = 'textbox draggable resizable';
        textbox.contentEditable = true;
        textbox.textContent = 'Caixa de texto';
        editor.appendChild(textbox);
        saveVersion();
    };

    imageBtn.onclick = () => imageInput.click();
    imageInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = document.createElement('img');
                img.src = event.target.result;
                img.style.maxWidth = '300px';
                img.className = 'draggable resizable';
                editor.appendChild(img);
                saveVersion();
            };
            reader.readAsDataURL(file);
        }
    };

    loadPDFBtn.onclick = () => pdfInput.click();
    pdfInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const typedArray = new Uint8Array(event.target.result);
                const pdf = await pdfjsLib.getDocument(typedArray).promise;
                let textContent = '';

                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const text = await page.getTextContent();
                    text.items.forEach(item => {
                        textContent += item.str + ' ';
                    });
                    textContent += '\n';
                }

                const textDiv = document.createElement('div');
                textDiv.textContent = textContent;
                editor.appendChild(textDiv);
                saveVersion();
            };
            reader.readAsArrayBuffer(file);
        } else {
            alert('Por favor, selecione um arquivo PDF válido.');
        }
    };

    chartBtn.onclick = () => {
        const type = prompt('Tipo de gráfico (bar, line, pie):');
        if (!['bar', 'line', 'pie'].includes(type)) {
            alert('Tipo de gráfico inválido. Escolha entre bar, line ou pie.');
            return;
        }

        const labels = prompt('Digite os rótulos (separados por vírgula):');
        const data = prompt('Digite os dados (separados por vírgula):');
        const title = prompt('Digite o título do gráfico:');

        if (labels && data && title) {
            const chartContainer = document.createElement('div');
            chartContainer.className = 'chart-container draggable resizable';
            const canvas = document.createElement('canvas');
            chartContainer.appendChild(canvas);
            editor.appendChild(chartContainer);

            const chartData = {
                labels: labels.split(',').map(label => label.trim()),
                datasets: [{
                    label: title,
                    data: data.split(',').map(d => parseFloat(d.trim())),
                    backgroundColor: ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6'],
                    borderColor: '#2c3e50',
                    borderWidth: 1
                }]
            };

            new Chart(canvas, {
                type: type,
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: title }
                    }
                }
            });

            chartContainer.dataset.chartConfig = JSON.stringify({
                type: type,
                data: chartData,
                options: {
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: title }
                    }
                }
            });
            saveVersion();
        }
    };

    stickyNoteBtn.onclick = () => {
        const stickyNote = document.createElement('div');
        stickyNote.className = 'sticky-note draggable resizable';
        stickyNote.contentEditable = true;
        stickyNote.textContent = 'Nota adesiva';
        stickyNote.style.left = '50px';
        stickyNote.style.top = '50px';
        editor.appendChild(stickyNote);
        saveVersion();
    };

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentCanvas = null;
    let ctx = null;

    drawBtn.onclick = () => {
        const canvas = document.createElement('canvas');
        canvas.className = 'drawing-canvas draggable resizable';
        canvas.width = 300;
        canvas.height = 200;
        editor.appendChild(canvas);
        ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.style.position = 'absolute';
        colorPicker.style.top = '0';
        colorPicker.style.right = '0';
        colorPicker.onchange = (e) => ctx.strokeStyle = e.target.value;

        const lineWidthSelect = document.createElement('select');
        [2, 5, 10].forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = `${size}px`;
            lineWidthSelect.appendChild(option);
        });
        lineWidthSelect.onchange = (e) => ctx.lineWidth = e.target.value;

        canvas.appendChild(colorPicker);
        canvas.appendChild(lineWidthSelect);
        currentCanvas = canvas;
        saveVersion();
    };

    function startDrawing(e) {
        isDrawing = true;
        const rect = currentCanvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
    }

    function draw(e) {
        if (!isDrawing) return;
        const rect = currentCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        lastX = x;
        lastY = y;
    }

    function stopDrawing() {
        isDrawing = false;
        saveVersion();
    }

    shapeBtn.onclick = () => {
        const shapeType = prompt('Digite o tipo de forma (rectangle, circle, line):');
        if (!['rectangle', 'circle', 'line'].includes(shapeType)) {
            alert('Tipo de forma inválido. Escolha entre rectangle, circle ou line.');
            return;
        }

        const shapeContainer = document.createElement('div');
        shapeContainer.className = 'shape-container draggable resizable';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100');
        svg.setAttribute('height', '100');

        let shape;
        if (shapeType === 'rectangle') {
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            shape.setAttribute('x', '10');
            shape.setAttribute('y', '10');
            shape.setAttribute('width', '80');
            shape.setAttribute('height', '80');
        } else if (shapeType === 'circle') {
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            shape.setAttribute('cx', '50');
            shape.setAttribute('cy', '50');
            shape.setAttribute('r', '40');
        } else if (shapeType === 'line') {
            shape = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            shape.setAttribute('x1', '10');
            shape.setAttribute('y1', '10');
            shape.setAttribute('x2', '90');
            shape.setAttribute('y2', '90');
        }

        shape.setAttribute('stroke', '#000000');
        shape.setAttribute('stroke-width', '2');
        shape.setAttribute('fill', shapeType === 'line' ? 'none' : '#3498db');
        svg.appendChild(shape);
        shapeContainer.appendChild(svg);

        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.style.position = 'absolute';
        colorPicker.style.top = '0';
        colorPicker.style.right = '0';
        colorPicker.onchange = (e) => shape.setAttribute('stroke', e.target.value);

        const fillPicker = document.createElement('input');
        fillPicker.type = 'color';
        fillPicker.style.position = 'absolute';
        fillPicker.style.top = '30px';
        fillPicker.style.right = '0';
        fillPicker.onchange = (e) => {
            if (shapeType !== 'line') shape.setAttribute('fill', e.target.value);
        };

        const strokeWidthSelect = document.createElement('select');
        [1, 2, 5].forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = `${size}px`;
            strokeWidthSelect.appendChild(option);
        });
        strokeWidthSelect.style.position = 'absolute';
        strokeWidthSelect.style.top = '60px';
        strokeWidthSelect.style.right = '0';
        strokeWidthSelect.onchange = (e) => shape.setAttribute('stroke-width', e.target.value);

        shapeContainer.appendChild(colorPicker);
        shapeContainer.appendChild(fillPicker);
        shapeContainer.appendChild(strokeWidthSelect);
        editor.appendChild(shapeContainer);
        saveVersion();
    };

    templateSelect.onchange = () => {
        const template = templateSelect.value;
        if (template) {
            let content = '';
            if (template === 'letter') {
                content = `
                    <div style="text-align: right;">[Cidade], [Data]</div>
                    <div style="margin-top: 20px;">[Nome do Destinatário]<br>[Endereço]<br>[Cidade, Estado, CEP]</div>
                    <div style="margin-top: 20px;">Prezado(a) [Destinatário],</div>
                    <div style="margin-top: 20px;">[Corpo da carta]</div>
                    <div style="margin-top: 20px;">Atenciosamente,<br>[Seu Nome]</div>
                `;
            } else if (template === 'report') {
                content = `
                    <h1 style="text-align: center;">Relatório</h1>
                    <h2>Introdução</h2>
                    <p>[Texto da introdução]</p>
                    <h2>Metodologia</h2>
                    <p>[Descrição da metodologia]</p>
                    <h2>Resultados</h2>
                    <p>[Descrição dos resultados]</p>
                    <h2>Conclusão</h2>
                    <p>[Conclusões do relatório]</p>
                `;
            } else if (template === 'resume') {
                content = `
                    <h1 style="text-align: center;">[Seu Nome]</h1>
                    <div style="text-align: center;">[Endereço] | [Telefone] | [E-mail]</div>
                    <h2>Objetivo</h2>
                    <p>[Descrição do objetivo profissional]</p>
                    <h2>Formação</h2>
                    <p>[Instituição, Curso, Ano]</p>
                    <h2>Experiência Profissional</h2>
                    <p>[Empresa, Cargo, Período]</p>
                    <h2>Habilidades</h2>
                    <p>[Lista de habilidades]</p>
                `;
            }
            editor.innerHTML = content;
            saveVersion();
        }
    };

    searchReplaceBtn.onclick = () => {
        const modal = document.getElementById('searchReplaceModal');
        if (modal) modal.style.display = 'flex';
    };

    function closeModal() {
        const modal = document.getElementById('searchReplaceModal');
        if (modal) modal.style.display = 'none';
    }

    function replaceText() {
        const search = document.getElementById('searchText')?.value;
        const replace = document.getElementById('replaceText')?.value;
        if (search) {
            const range = window.getSelection().getRangeAt(0);
            const text = editor.textContent;
            const index = text.indexOf(search, range.startOffset);
            if (index !== -1) {
                const newText = text.substring(0, index) + replace + text.substring(index + search.length);
                editor.textContent = newText;
                saveVersion();
            } else {
                alert('Texto não encontrado.');
            }
        }
    }

    function replaceAllText() {
        const search = document.getElementById('searchText')?.value;
        const replace = document.getElementById('replaceText')?.value;
        if (search) {
            const regex = new RegExp(search, 'g');
            editor.innerHTML = editor.innerHTML.replace(regex, replace);
            saveVersion();
        }
    }

    printPreviewBtn.onclick = () => {
        editor.classList.toggle('print-preview');
        if (editor.classList.contains('print-preview')) {
            printPreviewBtn.classList.add('active');
            editor.style.minHeight = pageSize.value === 'a4' ? '297mm' : pageSize.value === 'letter' ? '279.4mm' : pageSize.value === 'legal' ? '355.6mm' : '420mm';
        } else {
            printPreviewBtn.classList.remove('active');
            editor.style.minHeight = 'calc(100vh - 90px)';
        }
    };

    exportSelectionBtn.onclick = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const div = document.createElement('div');
            div.appendChild(range.cloneContents());
            const fileName = prompt('Digite o nome do arquivo (sem extensão):', 'selecao');
            const finalFileName = fileName && fileName.trim() ? `${fileName.trim()}.pdf` : 'selecao.pdf';
            generatePDF('download', finalFileName, div);
        } else {
            alert('Selecione o texto ou elementos para exportar.');
        }
    };

    versionHistoryBtn.onclick = () => {
        if (versionHistory.length === 0) {
            alert('Nenhuma versão salva.');
            return;
        }
        const version = prompt(`Escolha uma versão (0 a ${currentVersion}):`);
        const index = parseInt(version);
        if (index >= 0 && index <= currentVersion) {
            editor.innerHTML = versionHistory[index];
            currentVersion = index;
        } else {
            alert('Versão inválida.');
        }
    };

    themeBtn.onclick = () => {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    };

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }

    function generatePDF(action, fileName = 'documento.pdf', content = editor) {
        const doc = new jsPDF({ format: pageSize.value });
        let y = 10;
        const pageHeight = doc.internal.pageSize.getHeight();
        const marginBottom = 10;
        const maxY = pageHeight - marginBottom;

        // Função para converter cor CSS para RGB
        function cssColorToRGB(color) {
            if (color.startsWith('#')) {
                let hex = color.replace('#', '');
                if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                return [r, g, b];
            } else if (color.startsWith('rgb')) {
                const match = color.match(/\d+/g);
                return match ? [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])] : [0, 0, 0];
            }
            return [0, 0, 0]; // Padrão: preto
        }

        const processNode = (node) => {
            if (node.nodeType === 3) { // Texto simples
                const text = node.textContent.trim();
                if (text) {
                    const parent = node.parentElement || document.body;
                    const style = window.getComputedStyle(parent);
                    const fontFamily = style.fontFamily.replace(/['"]/g, '').split(',')[0].trim();
                    doc.setFont(fontFamily, 'normal');
                    doc.setFontSize(parseInt(style.fontSize));
                    if (style.fontWeight >= 700 || style.fontWeight === 'bold') doc.setFont(undefined, 'bold');
                    if (style.fontStyle === 'italic') doc.setFont(undefined, 'italic');
                    if (style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
                        const [r, g, b] = cssColorToRGB(style.backgroundColor);
                        doc.setFillColor(r, g, b);
                    }
                    if (style.color) {
                        const [r, g, b] = cssColorToRGB(style.color);
                        doc.setTextColor(r, g, b);
                    }
                    const textAlign = style.textAlign || 'left';
                    const align = textAlign === 'center' ? 'center' : textAlign === 'right' ? 'right' : 'left';
                    const textWidth = doc.internal.pageSize.getWidth() - 20;
                    const textLines = doc.splitTextToSize(text, textWidth);
                    const lineHeight = parseInt(style.fontSize) / 2;

                    textLines.forEach(line => {
                        if (y + lineHeight > maxY) {
                            doc.addPage();
                            y = 10;
                        }
                        const xPos = align === 'center' ? doc.internal.pageSize.getWidth() / 2 : align === 'right' ? doc.internal.pageSize.getWidth() - 10 : 10;
                        doc.text(line, xPos, y, { align: align });
                        // Suporte para sublinhado
                        if (style.textDecoration === 'underline') {
                            const textWidth = doc.getTextWidth(line);
                            const startX = align === 'center' ? xPos - textWidth / 2 : align === 'right' ? xPos - textWidth : xPos;
                            doc.line(startX, y + 1, startX + textWidth, y + 1);
                        }
                        y += lineHeight;
                    });
                }
            } else if (node.nodeName === 'IMG') {
                const imgHeight = 50;
                if (y + imgHeight > maxY) {
                    doc.addPage();
                    y = 10;
                }
                try {
                    doc.addImage(node.src, 'PNG', 10, y, 50, 50);
                    y += imgHeight + 10;
                } catch (e) {
                    console.error('Erro ao adicionar imagem ao PDF:', e);
                }
            } else if (node.nodeName === 'TABLE') {
                const rows = Array.from(node.rows).map(row =>
                    Array.from(row.cells).map(cell => cell.textContent)
                );
                const tableHeightEstimate = rows.length * 10;
                if (y + tableHeightEstimate > maxY) {
                    doc.addPage();
                    y = 10;
                }
                doc.autoTable({
                    startY: y,
                    body: rows,
                    theme: 'grid',
                    styles: { fontSize: 10 },
                    columnStyles: { 0: { cellWidth: 'auto' } }
                });
                y = doc.lastAutoTable.finalY + 10;
            } else if (node.className.includes('textbox')) {
                const textboxHeight = 25;
                if (y + textboxHeight > maxY) {
                    doc.addPage();
                    y = 10;
                }
                doc.setDrawColor(52, 152, 219);
                doc.setFillColor(255, 255, 255);
                doc.rect(10, y - 5, 100, 20, 'FD');
                doc.setTextColor(0, 0, 0);
                doc.text(node.textContent, 12, y, { maxWidth: 96 });
                y += textboxHeight;
            } else if (node.nodeName === 'A') {
                const linkHeight = 10;
                if (y + linkHeight > maxY) {
                    doc.addPage();
                    y = 10;
                }
                doc.setTextColor(0, 0, 255);
                doc.textWithLink(node.textContent, 10, y, { url: node.href });
                y += linkHeight;
            } else if (node.className.includes('video-preview')) {
                const videoUrl = node.dataset.url;
                const linkHeight = 10;
                if (y + linkHeight > maxY) {
                    doc.addPage();
                    y = 10;
                }
                doc.setTextColor(0, 0, 255);
                doc.textWithLink(`Vídeo: ${videoUrl}`, 10, y, { url: videoUrl });
                y += linkHeight;
            } else if (node.nodeName === 'OL' || node.nodeName === 'UL') {
                const items = Array.from(node.children).map(li => li.textContent);
                const itemHeight = 10;
                items.forEach((item, index) => {
                    if (y + itemHeight > maxY) {
                        doc.addPage();
                        y = 10;
                    }
                    doc.text(`${node.nodeName === 'OL' ? `${index + 1}.` : '•'} ${item}`, 10, y);
                    y += itemHeight;
                });
            } else if (node.className.includes('chart-container')) {
                const canvas = node.querySelector('canvas');
                if (canvas) {
                    const imgData = canvas.toDataURL('image/png');
                    const chartHeight = 100;
                    if (y + chartHeight > maxY) {
                        doc.addPage();
                        y = 10;
                    }
                    try {
                        doc.addImage(imgData, 'PNG', 10, y, 100, 50);
                        y += chartHeight + 10;
                    } catch (e) {
                        console.error('Erro ao adicionar gráfico ao PDF:', e);
                    }
                }
            } else if (node.className.includes('sticky-note')) {
                const noteHeight = 50;
                if (y + noteHeight > maxY) {
                    doc.addPage();
                    y = 10;
                }
                doc.setFillColor(255, 215, 0);
                doc.rect(10, y - 5, 100, 40, 'F');
                doc.setTextColor(0, 0, 0);
                doc.text(node.textContent, 12, y, { maxWidth: 96 });
                y += noteHeight;
            } else if (node.className.includes('drawing-canvas')) {
                const imgData = node.toDataURL('image/png');
                const canvasHeight = 50;
                if (y + canvasHeight > maxY) {
                    doc.addPage();
                    y = 10;
                }
                try {
                    doc.addImage(imgData, 'PNG', 10, y, 100, 50);
                    y += canvasHeight + 10;
                } catch (e) {
                    console.error('Erro ao adicionar desenho ao PDF:', e);
                }
            } else if (node.className.includes('shape-container')) {
                const svg = node.querySelector('svg');
                if (svg) {
                    const shape = svg.children[0];
                    const shapeHeight = 50;
                    if (y + shapeHeight > maxY) {
                        doc.addPage();
                        y = 10;
                    }
                    const strokeColor = cssColorToRGB(shape.getAttribute('stroke') || '#000000');
                    const fillColor = cssColorToRGB(shape.getAttribute('fill') || '#3498db');
                    doc.setDrawColor(strokeColor[0], strokeColor[1], strokeColor[2]);
                    doc.setLineWidth(parseFloat(shape.getAttribute('stroke-width') || '2'));
                    if (shape.tagName === 'rect') {
                        doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
                        doc.rect(10, y, 50, 50, shape.getAttribute('fill') ? 'FD' : 'S');
                    } else if (shape.tagName === 'circle') {
                        doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
                        doc.circle(35, y + 25, 25, shape.getAttribute('fill') ? 'FD' : 'S');
                    } else if (shape.tagName === 'line') {
                        doc.line(10, y, 60, y + 50);
                    }
                    y += shapeHeight + 10;
                }
            }
            if (node.childNodes) node.childNodes.forEach(processNode);
        };

        content.childNodes.forEach(processNode);

        if (action === 'download') {
            try {
                doc.save(fileName);
            } catch (e) {
                console.error('Erro ao baixar PDF:', e);
                alert('Erro ao gerar o PDF. Verifique o console para mais detalhes.');
            }
        } else if (action === 'share') {
            try {
                const pdfBlob = doc.output('blob');
                const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
                if (navigator.share) {
                    navigator.share({
                        files: [file],
                        title: 'Meu PDF',
                        text: 'Confira meu documento PDF!',
                    }).catch(err => {
                        console.error('Erro ao compartilhar PDF:', err);
                        alert('Erro ao compartilhar PDF. Verifique o console para mais detalhes.');
                    });
                } else {
                    alert('Compartilhamento não suportado neste navegador.');
                }
            } catch (e) {
                console.error('Erro ao gerar PDF para compartilhamento:', e);
                alert('Erro ao gerar PDF para compartilhamento. Verifique o console para mais detalhes.');
            }
        }
    }

    downloadBtn.onclick = () => {
        const fileName = prompt('Digite o nome do arquivo (sem extensão):', 'documento');
        const finalFileName = fileName && fileName.trim() ? `${fileName.trim()}.pdf` : 'documento.pdf';
        generatePDF('download', finalFileName);
    };

    shareBtn.onclick = () => generatePDF('share');

    undoBtn.onclick = () => {
        document.execCommand('undo', false, null);
        saveVersion();
    };
    redoBtn.onclick = () => {
        document.execCommand('redo', false, null);
        saveVersion();
    };

    if (typeof interact === 'undefined') {
        console.error('interact.js não está definido. Verifique se a biblioteca foi carregada corretamente.');
    } else {
        interact('.draggable').draggable({
            listeners: {
                move(event) {
                    const target = event.target;
                    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                    target.style.transform = `translate(${x}px, ${y}px)`;
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);
                }
            }
        });

        interact('.resizable').resizable({
            edges: { left: true, right: true, bottom: true, top: true },
            listeners: {
                move(event) {
                    const target = event.target;
                    let x = (parseFloat(target.getAttribute('data-x')) || 0);
                    let y = (parseFloat(target.getAttribute('data-y')) || 0);
                    target.style.width = event.rect.width + 'px';
                    target.style.height = event.rect.height + 'px';
                    x += event.deltaRect.left;
                    y += event.deltaRect.top;
                    target.style.transform = `translate(${x}px, ${y}px)`;
                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);

                    if (target.className.includes('chart-container')) {
                        const canvas = target.querySelector('canvas');
                        const chart = Chart.getChart(canvas);
                        if (chart) {
                            chart.resize();
                        }
                    } else if (target.className.includes('shape-container')) {
                        const svg = target.querySelector('svg');
                        if (svg) {
                            svg.setAttribute('width', event.rect.width);
                            svg.setAttribute('height', event.rect.height);
                            const shape = svg.children[0];
                            if (shape.tagName === 'rect') {
                                shape.setAttribute('width', event.rect.width - 20);
                                shape.setAttribute('height', event.rect.height - 20);
                            } else if (shape.tagName === 'circle') {
                                shape.setAttribute('cx', event.rect.width / 2);
                                shape.setAttribute('cy', event.rect.height / 2);
                                shape.setAttribute('r', Math.min(event.rect.width, event.rect.height) / 2 - 10);
                            } else if (shape.tagName === 'line') {
                                shape.setAttribute('x2', event.rect.width - 10);
                                shape.setAttribute('y2', event.rect.height - 10);
                            }
                        }
                    }
                }
            }
        });
    }

    editor.addEventListener('click', () => {
        boldBtn.classList.toggle('active', document.queryCommandState('bold'));
        italicBtn.classList.toggle('active', document.queryCommandState('italic'));
        underlineBtn.classList.toggle('active', document.queryCommandState('underline'));
        alignLeftBtn.classList.toggle('active', document.queryCommandState('justifyLeft'));
        alignCenterBtn.classList.toggle('active', document.queryCommandState('justifyCenter'));
        alignRightBtn.classList.toggle('active', document.queryCommandState('justifyRight'));
        orderedListBtn.classList.toggle('active', document.queryCommandState('insertOrderedList'));
        unorderedListBtn.classList.toggle('active', document.queryCommandState('insertUnorderedList'));
    });

    editor.addEventListener('input', () => {
        localStorage.setItem('editorContent', editor.innerHTML);
        saveVersion();
    });

    if (localStorage.getItem('editorContent')) {
        editor.innerHTML = localStorage.getItem('editorContent');
        document.querySelectorAll('.chart-container').forEach(container => {
            const canvas = container.querySelector('canvas');
            if (canvas && container.dataset.chartConfig) {
                const config = JSON.parse(container.dataset.chartConfig);
                new Chart(canvas, {
                    type: config.type,
                    data: config.data,
                    options: config.options
                });
            }
        });
        saveVersion();
    }
});
 
