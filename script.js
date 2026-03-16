let dadosEmpresa = null;

async function consultarCNPJ() {
    const cnpj = document.getElementById('cnpjInput').value.replace(/\D/g, '');
    const resultadoDiv = document.getElementById('resultado');
    const pdfBtn = document.getElementById('pdfBtn');

    if (cnpj.length !== 14) {
        alert("O CNPJ deve ter 14 números.");
        return;
    }

    resultadoDiv.innerHTML = "<p>Buscando dados na Receita Federal...</p>";

    try {
        const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
        if (!response.ok) throw new Error('CNPJ não encontrado ou erro na base de dados.');
        
        dadosEmpresa = await response.json();
        
        resultadoDiv.innerHTML = `
            <table id="tabelaDados">
                <tr><th>Razão Social</th><td>${dadosEmpresa.razao_social}</td></tr>
                <tr><th>Nome Fantasia</th><td>${dadosEmpresa.nome_fantasia || 'N/A'}</td></tr>
                <tr><th>Atividade</th><td>${dadosEmpresa.cnae_fiscal_descricao}</td></tr>
                <tr><th>Capital Social</th><td>R$ ${dadosEmpresa.capital_social.toLocaleString('pt-BR')}</td></tr>
                <tr><th>Endereço</th><td>${dadosEmpresa.logradouro}, ${dadosEmpresa.numero} - ${dadosEmpresa.municipio}/${dadosEmpresa.uf}</td></tr>
                <tr><th>Telefone</th><td>${dadosEmpresa.ddd_telefone_1}</td></tr>
            </table>`;
        pdfBtn.style.display = "block";

    } catch (error) {
        resultadoDiv.innerHTML = `<p style="color:red">${error.message}</p>`;
        pdfBtn.style.display = "none";
    }
}

function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Comprovante de Consulta de CNPJ", 14, 15);
    doc.autoTable({ html: '#tabelaDados', startY: 25 });
    doc.save(`empresa_${dadosEmpresa.cnpj}.pdf`);
}
