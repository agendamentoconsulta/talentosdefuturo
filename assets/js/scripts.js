document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById('modal');
    var btn = document.getElementById('consultaBtn');
    var span = document.getElementsByClassName('close')[0];
    var cpfInput = document.getElementById('cpf');

    // Adiciona a máscara de CPF ao campo de entrada
    cpfInput.addEventListener('input', function (event) {
        var value = event.target.value.replace(/\D/g, '');
        if (value.length > 11) {
            value = value.slice(0, 11);
        }
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        event.target.value = value;
    });

    // Quando o usuário clicar no botão, abre o modal
    btn.onclick = function (event) {
        event.preventDefault();
        var rect = btn.getBoundingClientRect();
        modal.style.top = rect.bottom + window.scrollY + 'px';
        modal.style.left = rect.left + 'px';
        modal.style.display = 'block';
    }

    // Quando o usuário clicar no <span> (x), fecha o modal
    span.onclick = function () {
        modal.style.display = 'none';
    }

    // Quando o usuário clicar fora do modal, fecha o modal
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Adiciona um evento de submit ao formulário
    document.getElementById('consultaForm').addEventListener('submit', function (event) {
        event.preventDefault();
        login();
    });

    // Declara a função de login
    function login() {
        var cpf = document.getElementById('cpf').value.replace(/\D/g, '');
        var senha = document.getElementById('senha').value;

        const options = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'User-Agent': 'insomnia/9.3.1'},
            body: JSON.stringify({ cpf, senha })
        };

        fetch('https://mediquors.tsulmed.com/api/auth', options)
            .then(response => response.json())
            .then(data => {
                if (data.access_token) {
                    MediquoWidget.init({
                        apiKey: "bi2Dbf0whvaPiXYE",
                        accessToken: data.access_token,
                        launcher: "hidden",
                        isMobileView: true,
                        adapter: "cordova",
                        theme: {
                            position: "center",
                            locale: "pt",
                            colors: {
                                primary: "#4a1ea7",
                                primaryContrast: "#FFFFFF",
                                secondary: "#4a1ea7",
                                accent: "#4a1ea7",
                                messageTextSystem: "#4a1ea7",
                                messageTextOutgoing: "#4a1ea7",
                                messageTextIncoming: "#4a1ea7",
                                bubbleBackgroundSystem: "#f7f8fa",
                                bubbleBackgroundOutgoing: "#f7f8fa",
                                bubbleBackgroundIncoming: "#f7f8fa",
                                alertText: "#4a1ea7",
                                alertBackground: "#f7f8fa",
                            },
                            hideCloseButton: "false",
                            text: {
				title: "Atendimento",
                                terms: "li e aceito os termos de utilização",
                                welcome_title: "Bem Vindo",
                                medical_consent_disclaimer: 'Medico consentimento',
                            }    
                        }
                    }).then(() => {
                        MediquoWidget.open();
                    }).catch(error => {
                        console.error("Erro ao inicializar o widget:", error);
                    });

                    // Fechar o modal
                    modal.style.display = 'none';
                } else {
                    console.error("Erro de autenticação:", data);
                }
            })
            .catch(err => {
                console.error("Erro na requisição:", err);
            });
    }
});
