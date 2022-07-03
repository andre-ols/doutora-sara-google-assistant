async function fallback() {
    return { response: 'Poxa... não consegui entender 😪\nPode escrever de uma outra maneira?' }
}

async function planFallback() {
    return { response: 'Por favor, digite uma das opções de plano acima\nCaso seja uma consulta paga, digite *particular*' }
}

async function doctorFallback() {
    return { response: 'Ao lado do nome do médico existe um número, digite o número do médico que deseja ser atendido(a) 😁' }
}

async function calendarFallback() {
    return { response: 'Ao lado da data existe um número, digite o número da data que deseja ser atendido(a) 😁' }
}

async function finishFallback() {
    return { response: [
        'Digite *confimar* para marcar a consulta ou *refazer* caso tenha algo de errado',
        'Teve dificuldades com a doutora Sara? Digite *falar com atendente* e irei te tranferir para um atendente humano'] 
    }
}