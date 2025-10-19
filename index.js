const cheerio = require('cheerio');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors({
    origin: '*'
}));


async function ListarLaudos(placa) {
    try {

        const response = await fetch('http://denatran4.serpro.gov.br/siscsv/denatranportal2/Laudos/ListarLaudos.aspx', {
            method: 'POST',
            headers: {
                'Host': 'denatran4.serpro.gov.br',
                'Cache-Control': 'max-age=0',
                'Origin': 'http://denatran4.serpro.gov.br',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Referer': 'http://denatran4.serpro.gov.br/siscsv/denatranportal2/Laudos/ListarLaudos.aspx',
                'Accept-Language': 'pt-BR,pt;q=0.9',
                'Cookie': await GetCookie(),
            },
            body: new URLSearchParams({
                'ctl00$ContentPlaceDefault$txtPlaca': placa,
                'ctl00$ContentPlaceDefault$txtDtStart': '',
                'ctl00$ContentPlaceDefault$txtDtEnd': '',
                'ctl00$ContentPlaceDefault$txtCodigoLaudo': '',
                'ctl00$ContentPlaceDefault$ddlStatus': '',
                'ctl00$ContentPlaceDefault$btnBuscar': 'Listar',
                '__VIEWSTATE': '/wEPDwULLTE5NjY3NDA2NzUPZBYCZg9kFgRmD2QWAgIHDxYCHgRUZXh0BShjdGwwMF9Db250ZW50UGxhY2VEZWZhdWx0X01lc3NhZ2VTdW1tYXJ5ZAIBD2QWCAIDDw8WAh8ABQdGZWZldGNoZGQCBQ8PFgIfAAUIKExBVURPUylkZAITD2QWAmYPPCsACQIADxYGHg1OZXZlckV4cGFuZGVkZB4MU2VsZWN0ZWROb2RlZB4JTGFzdEluZGV4AhRkCBQrAAYFEzA6MCwwOjEsMDoyLDA6MywwOjQUKwACFgQfAAUIw5NyZ8Ojb3MeCEV4cGFuZGVkZxQrAAYFEzA6MCwwOjEsMDoyLDA6MywwOjQUKwACFgofAAUTw5NyZ8Ojb3MgRXhlY3V0aXZvcx4FVmFsdWUFF09yZ2Fvc1xMaXN0YU9yZ2Fvcy5hc3B4HgtOYXZpZ2F0ZVVybAUaLi4vT3JnYW9zXExpc3RhT3JnYW9zLmFzcHgeB1Rvb2xUaXAFIUNsaXF1ZSBhcXVpIC0gw5NyZ8Ojb3MgRXhlY3V0aXZvcx8EZ2QUKwACFgofAAUEVUdDcx8FBRRPcmdhb3NcTGlzdGFVR0MuYXNweB8GBRcuLi9Pcmdhb3NcTGlzdGFVR0MuYXNweB8HBRJDbGlxdWUgYXF1aSAtIFVHQ3MfBGdkFCsAAhYKHwAFBElUTHMfBQUVT3JnYW9zXExpc3RhSXRscy5hc3B4HwYFGC4uL09yZ2Fvc1xMaXN0YUl0bHMuYXNweB8HBRJDbGlxdWUgYXF1aSAtIElUTHMfBGdkFCsAAhYKHwAFEENpcmN1bnNjcmnDp8O1ZXMfBQUeT3JnYW9zXExpc3RhQ2lyY3Vuc2NyaWNhby5hc3B4HwYFIS4uL09yZ2Fvc1xMaXN0YUNpcmN1bnNjcmljYW8uYXNweB8HBR5DbGlxdWUgYXF1aSAtIENpcmN1bnNjcmnDp8O1ZXMfBGdkFCsAAhYKHwAFBEVDVnMfBQUUT3JnYW9zXExpc3RhRUNWLmFzcHgfBgUXLi4vT3JnYW9zXExpc3RhRUNWLmFzcHgfBwUSQ2xpcXVlIGFxdWkgLSBFQ1ZzHwRnZBQrAAIWBB8ABQlVc3XDoXJpb3MfBGcUKwADBQcwOjAsMDoxFCsAAhYKHwAFCVVzdcOhcmlvcx8FBRtVc3Vhcmlvc1xMaXN0YVVzdWFyaW9zLmFzcHgfBgUeLi4vVXN1YXJpb3NcTGlzdGFVc3Vhcmlvcy5hc3B4HwcFF0NsaXF1ZSBhcXVpIC0gVXN1w6FyaW9zHwRnZBQrAAIWCh8ABRJQZXJmaXMgZGUgVXN1w6FyaW8fBQUaVXN1YXJpb3NcTGlzdGFyUGVyZmlzLmFzcHgfBgUdLi4vVXN1YXJpb3NcTGlzdGFyUGVyZmlzLmFzcHgfBwUgQ2xpcXVlIGFxdWkgLSBQZXJmaXMgZGUgVXN1w6FyaW8fBGdkFCsAAhYEHwAFA0NTVh8EZxQrAAMFBzA6MCwwOjEUKwACFgofAAURSGlzdMOzcmljbyBkZSBDU1YfBQUVQ1NWXEhpc3Rvcmljb0Nzdi5hc3B4HwYFGC4uL0NTVlxIaXN0b3JpY29Dc3YuYXNweB8HBR9DbGlxdWUgYXF1aSAtIEhpc3TDs3JpY28gZGUgQ1NWHwRnZBQrAAIWCh8ABQ1BY2VpdGUgZGUgQ1NWHwUFEkNTVlxBY2VpdGVDc3YuYXNweB8GBRUuLi9DU1ZcQWNlaXRlQ3N2LmFzcHgfBwUbQ2xpcXVlIGFxdWkgLSBBY2VpdGUgZGUgQ1NWHwRnZBQrAAIWBB8ABRJMYXVkb3MgZGUgVmlzdG9yaWEfBGcUKwAGBRMwOjAsMDoxLDA6MiwwOjMsMDo0FCsAAhYKHwAFEVRlbXBvIGRlIEVtaXNzw6NvHwUFIUxhdWRvc1xDYWRhc3RyYXJDb25maWd1cmFjYW8uYXNweB8GBSQuLi9MYXVkb3NcQ2FkYXN0cmFyQ29uZmlndXJhY2FvLmFzcHgfBwUfQ2xpcXVlIGFxdWkgLSBUZW1wbyBkZSBFbWlzc8Ojbx8EZ2QUKwACFgofAAUSR3J1cG9zIGRlIFZpc3RvcmlhHwUFH0xhdWRvc1xMaXN0YXJHcnVwb1Zpc3RvcmlhLmFzcHgfBgUiLi4vTGF1ZG9zXExpc3RhckdydXBvVmlzdG9yaWEuYXNweB8HBSBDbGlxdWUgYXF1aSAtIEdydXBvcyBkZSBWaXN0b3JpYR8EZ2QUKwACFgofAAURSXRlbnMgZGUgVmlzdG9yaWEfBQUjTGF1ZG9zXExpc3Rhckl0ZW1HcnVwb1Zpc3RvcmlhLmFzcHgfBgUmLi4vTGF1ZG9zXExpc3Rhckl0ZW1HcnVwb1Zpc3RvcmlhLmFzcHgfBwUfQ2xpcXVlIGFxdWkgLSBJdGVucyBkZSBWaXN0b3JpYR8EZ2QUKwACFgofAAUGTGF1ZG9zHwUFGExhdWRvc1xMaXN0YXJMYXVkb3MuYXNweB8GBRsuLi9MYXVkb3NcTGlzdGFyTGF1ZG9zLmFzcHgfBwUUQ2xpcXVlIGFxdWkgLSBMYXVkb3MfBGdkFCsAAhYKHwAFEUxhdWRvcyBBbnRlcmlvcmVzHwUFGUxhdWRvc1xDb25zdWx0YUxhdWRvLmFzcHgfBgUcLi4vTGF1ZG9zXENvbnN1bHRhTGF1ZG8uYXNweB8HBR9DbGlxdWUgYXF1aSAtIExhdWRvcyBBbnRlcmlvcmVzHwRnZBQrAAIWBB8ABQRMb2dzHwRnFCsAAgUDMDowFCsAAhYKHwAFGFJlcXVpc2nDp8O1ZXMgV2ViU2VydmljZR8FBR9Mb2dzXFZpc3VhbGl6YXJMb2dDaGFtYWRhcy5hc3B4HwYFIi4uL0xvZ3NcVmlzdWFsaXphckxvZ0NoYW1hZGFzLmFzcHgfBwUmQ2xpcXVlIGFxdWkgLSBSZXF1aXNpw6fDtWVzIFdlYlNlcnZpY2UfBGdkZAIVD2QWCAIBDw8WBh4IQ3NzQ2xhc3NlHwBlHgRfIVNCAgJkZAIUDxAPFgYeDkRhdGFWYWx1ZUZpZWxkBQNLZXkeDURhdGFUZXh0RmllbGQFBVZhbHVlHgtfIURhdGFCb3VuZGdkEBUHBVRvZG9zBkFjZWl0bwpBZ3VhcmRhbmRvCUJsb3F1ZWFkbwlDYW5jZWxhZG8MRGVzYmxvcXVlYWRvEU7Do28tQ29uZm9ybWlkYWRlFQcAAUEBTgJJQQFEAVEBSRQrAwdnZ2dnZ2dnZGQCFg8PFgQfAAUYMyByZWdpc3Ryb3MgZW5jb250cmFkb3MuHgdWaXNpYmxlZ2RkAhcPPCsADQEADxYEHwxnHgtfIUl0ZW1Db3VudAIDZBYCZg9kFgoCAQ8PFgQfCAUBTh8JAgJkFhJmD2QWAmYPFQEMMDEyMjM2Njc4LTYzZAIBD2QWAmYPFQEHTUNOMjI0MmQCAg9kFgJmDxUBDzEyLzA0LzIwMTYgOToxMmQCAw9kFgJmDxUBGk5BQ0lPTkFMIFZJU1RPUklBIFZFSUNVTEFSZAIED2QWAmYPFQEKQWd1YXJkYW5kb2QCBQ9kFgICAQ8PFgIeDU9uQ2xpZW50Q2xpY2sFN3JldHVybiBBY2VpdGFyTGF1ZG8oIjEyMjM2Njc4XzEyLzA0LzIwMTYgMDk6MTI6MjJfNjMiKTtkZAIGD2QWAgIBDw8WAh8PBTtyZXR1cm4gRGVzYmxvcXVlYXJMYXVkbygiMTIyMzY2NzhfMTIvMDQvMjAxNiAwOToxMjoyMl82MyIpO2RkAgcPZBYCAgEPDxYCHg9Db21tYW5kQXJndW1lbnQFHzEyMjM2Njc4XzEyLzA0LzIwMTYgMDk6MTI6MjJfNjNkZAIID2QWAgIBDw8WAh8QBR8xMjIzNjY3OF8xMi8wNC8yMDE2IDA5OjEyOjIyXzYzZGQCAg8PFgQfCAUBTh8JAgJkFhJmD2QWAmYPFQEMMDExNjkzNjMyLTAyZAIBD2QWAmYPFQEHTUNOMjI0MmQCAg9kFgJmDxUBDzA5LzEyLzIwMTUgODoxMWQCAw9kFgJmDxUBE0dJUkFTU09MIFZJU1RPUklBUyBkAgQPZBYCZg8VAQpBZ3VhcmRhbmRvZAIFD2QWAgIBDw8WAh8PBTZyZXR1cm4gQWNlaXRhckxhdWRvKCIxMTY5MzYzMl8wOS8xMi8yMDE1IDA4OjExOjMzXzIiKTtkZAIGD2QWAgIBDw8WAh8PBTpyZXR1cm4gRGVzYmxvcXVlYXJMYXVkbygiMTE2OTM2MzJfMDkvMTIvMjAxNSAwODoxMTozM18yIik7ZGQCBw9kFgICAQ8PFgIfEAUeMTE2OTM2MzJfMDkvMTIvMjAxNSAwODoxMTozM18yZGQCCA9kFgICAQ8PFgIfEAUeMTE2OTM2MzJfMDkvMTIvMjAxNSAwODoxMTozM18yZGQCAw8PFgQfCAUBTh8JAgJkFhJmD2QWAmYPFQEMMDA1NzE4OTY2LTg1ZAIBD2QWAmYPFQEHTUNOMjI0MmQCAg9kFgJmDxUBEDA2LzAzLzIwMTQgMTc6MzJkAgMPZBYCZg8VAR1KVUxJQU5PIFZJU1RPUklBUyBBVVRPTU9USVZBU2QCBA9kFgJmDxUBCkFndWFyZGFuZG9kAgUPZBYCAgEPDxYCHw8FNnJldHVybiBBY2VpdGFyTGF1ZG8oIjU3MTg5NjZfMDYvMDMvMjAxNCAxNzozMjozMV84NSIpO2RkAgYPZBYCAgEPDxYCHw8FOnJldHVybiBEZXNibG9xdWVhckxhdWRvKCI1NzE4OTY2XzA2LzAzLzIwMTQgMTc6MzI6MzFfODUiKTtkZAIHD2QWAgIBDw8WAh8QBR41NzE4OTY2XzA2LzAzLzIwMTQgMTc6MzI6MzFfODVkZAIID2QWAgIBDw8WAh8QBR41NzE4OTY2XzA2LzAzLzIwMTQgMTc6MzI6MzFfODVkZAIEDw8WAh8NaGRkAgUPDxYCHw1oZGQYAgUeX19Db250cm9sc1JlcXVpcmVQb3N0QmFja0tleV9fFgEFD2N0bDAwJG1lbnUkbWVudQUjY3RsMDAkQ29udGVudFBsYWNlRGVmYXVsdCRndndMYXVkb3MPPCsACgEIAgFkbLP01aEsGm2oQuCeDmvBBXlK6Ps=',
                '__VIEWSTATEGENERATOR': '1AFD6294',
                '__EVENTVALIDATION': '/wEWIgKF2rHMBQLw5ey6BwKZlOu3DAKB+pLZDwKghtrMDQKCna25CwKZ8J7tDQKswJb9AwKVxrfJCQL5iZnDAQKp1t+hCgKihYDuAgL96qqADgLA6qqADgLF6qaeDgL+6qqADgLN6qqADgLF6qqADgLD1r3oCgLem+vWAQLU9LykDQLHjMqDCQLR1evWAQLn8YujDQLAiNmDCQLciuvWAQKWwrCkDQKF2oWDCQLsicWzAQKW5eHnBgLEyquvDQL8/tLDBwKXjpDOBgKunOFzc3I9FkWzV7YX364Z5LnSAEby77g=',
            })
        });

        const data = await response.text();
        const $ = cheerio.load(data);

        const laudo = $('[class="N"] > td').text().trim().split('-')[0];

        const rows = $('#ctl00_ContentPlaceDefault_gvwLaudos tbody tr.N');

        let list = [];

        rows.each((index, row) => {
            let cols = $(row).find('td');
            let record = {
                numeroLaudo: $(cols[0]).text().trim().split('-')[0],
                placa: $(cols[1]).text().trim(),
                dataHoraEmissao: $(cols[2]).text().trim(),
                ecv: $(cols[3]).text().trim(),
                status: $(cols[4]).text().trim()
            };

            list.push(record);
        });

        return list;
    } catch (err) {
        return 'Falha ao listar laudos!';
    }
};

const GetCookie = async () => {
    const r = await fetch('http://denatran4.serpro.gov.br/siscsv/denatranportal2/logon.aspx');
    const cookie = r.headers.get('set-cookie').split(' ')[0].replace(';', '');

    const $ = cheerio.load(await r.text());

    const __VIEWSTATE = $('#__VIEWSTATE').val();
    const __EVENTVALIDATION = $('#__EVENTVALIDATION').val();

    const send = await fetch('http://denatran4.serpro.gov.br/siscsv/denatranportal2/logon.aspx', {
        method: 'POST',
        headers: {
            'Host': 'denatran4.serpro.gov.br',
            'Cache-Control': 'max-age=0',
            'Upgrade-Insecure-Requests': '1',
            'Origin': 'http://denatran4.serpro.gov.br',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 7.1.2; ASUS_Z01QD Build/QKQ1.190825.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/119.0.6045.193 Mobile Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'X-Requested-With': 'com.android.browser',
            'Referer': 'http://denatran4.serpro.gov.br/siscsv/denatranportal2/logon.aspx',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Cookie': cookie
        },
        body: new URLSearchParams({
            '__EVENTTARGET': '',
            '__EVENTARGUMENT': '',
            '__VIEWSTATE': '/wEPDwULLTIwMDEzNjMzMjFkZJELWSSC+wCQLY7R9raYzvFmsA+U',
            '__VIEWSTATEGENERATOR': '557BC2AE',
            '__EVENTVALIDATION': '/wEWBALfx6vMBAK4+7bYCALxiYiEAQKFhsjCCYq/8f1nrhS8aJBxO1Fp2yqdDJNd',
            'txtCPF': '26935722829',
            'txtSenha': 'fetchviado',
            'aBt': 'Entrar'
        })
    });

    return cookie;
};



app.get('/listarLaudos/:placa', async (req, res) => {
    return res.json(await ListarLaudos(req.params.placa));
});

async function CodigoLaudoAspx(codigoLaudo) {

    const response = await fetch(`http://denatran4.serpro.gov.br/siscsv/denatranportal2/Laudos/Detalhes.aspx?codigoLaudo=${codigoLaudo}`, {

        method: 'POST',
        headers: {
            'Host': 'denatran4.serpro.gov.br',
            'Cache-Control': 'max-age=0',
            'Origin': 'http://denatran4.serpro.gov.br',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Referer': 'http://denatran4.serpro.gov.br/siscsv/denatranportal2/Laudos/ListarLaudos.aspx',
            'Accept-Language': 'pt-BR,pt;q=0.9',
            'Cookie': await GetCookie(),
        },
        body: new URLSearchParams({
            '__EVENTTARGET': '',
            '__EVENTARGUMENT': '',
            'ctl00_menu_menu_ExpandState': 'ennnnnennennennnnnen',
            'ctl00_menu_menu_SelectedNode': '',
            'ctl00_menu_menu_PopulateLog': '',
            '__VIEWSTATE': '/wEPDwULLTE5NjY3NDA2NzUPZBYCZg9kFgRmD2QWAgIHDxYCHgRUZXh0BShjdGwwMF9Db250ZW50UGxhY2VEZWZhdWx0X01lc3NhZ2VTdW1tYXJ5ZAIBD2QWCAIDDw8WAh8ABQdGZWZldGNoZGQCBQ8PFgIfAAUIKExBVURPUylkZAITD2QWAmYPPCsACQIADxYGHg1OZXZlckV4cGFuZGVkZB4MU2VsZWN0ZWROb2RlZB4JTGFzdEluZGV4AhRkCBQrAAYFEzA6MCwwOjEsMDoyLDA6MywwOjQUKwACFgQfAAUIw5NyZ8Ojb3MeCEV4cGFuZGVkZxQrAAYFEzA6MCwwOjEsMDoyLDA6MywwOjQUKwACFgofAAUTw5NyZ8Ojb3MgRXhlY3V0aXZvcx4FVmFsdWUFF09yZ2Fvc1xMaXN0YU9yZ2Fvcy5hc3B4HgtOYXZpZ2F0ZVVybAUaLi4vT3JnYW9zXExpc3RhT3JnYW9zLmFzcHgeB1Rvb2xUaXAFIUNsaXF1ZSBhcXVpIC0gw5NyZ8Ojb3MgRXhlY3V0aXZvcx8EZ2QUKwACFgofAAUEVUdDcx8FBRRPcmdhb3NcTGlzdGFVR0MuYXNweB8GBRcuLi9Pcmdhb3NcTGlzdGFVR0MuYXNweB8HBRJDbGlxdWUgYXF1aSAtIFVHQ3MfBGdkFCsAAhYKHwAFBElUTHMfBQUVT3JnYW9zXExpc3RhSXRscy5hc3B4HwYFGC4uL09yZ2Fvc1xMaXN0YUl0bHMuYXNweB8HBRJDbGlxdWUgYXF1aSAtIElUTHMfBGdkFCsAAhYKHwAFEENpcmN1bnNjcmnDp8O1ZXMfBQUeT3JnYW9zXExpc3RhQ2lyY3Vuc2NyaWNhby5hc3B4HwYFIS4uL09yZ2Fvc1xMaXN0YUNpcmN1bnNjcmljYW8uYXNweB8HBR5DbGlxdWUgYXF1aSAtIENpcmN1bnNjcmnDp8O1ZXMfBGdkFCsAAhYKHwAFBEVDVnMfBQUUT3JnYW9zXExpc3RhRUNWLmFzcHgfBgUXLi4vT3JnYW9zXExpc3RhRUNWLmFzcHgfBwUSQ2xpcXVlIGFxdWkgLSBFQ1ZzHwRnZBQrAAIWBB8ABQlVc3XDoXJpb3MfBGcUKwADBQcwOjAsMDoxFCsAAhYKHwAFCVVzdcOhcmlvcx8FBRtVc3Vhcmlvc1xMaXN0YVVzdWFyaW9zLmFzcHgfBgUeLi4vVXN1YXJpb3NcTGlzdGFVc3Vhcmlvcy5hc3B4HwcFF0NsaXF1ZSBhcXVpIC0gVXN1w6FyaW9zHwRnZBQrAAIWCh8ABRJQZXJmaXMgZGUgVXN1w6FyaW8fBQUaVXN1YXJpb3NcTGlzdGFyUGVyZmlzLmFzcHgfBgUdLi4vVXN1YXJpb3NcTGlzdGFyUGVyZmlzLmFzcHgfBwUgQ2xpcXVlIGFxdWkgLSBQZXJmaXMgZGUgVXN1w6FyaW8fBGdkFCsAAhYEHwAFA0NTVh8EZxQrAAMFBzA6MCwwOjEUKwACFgofAAURSGlzdMOzcmljbyBkZSBDU1YfBQUVQ1NWXEhpc3Rvcmljb0Nzdi5hc3B4HwYFGC4uL0NTVlxIaXN0b3JpY29Dc3YuYXNweB8HBR9DbGlxdWUgYXF1aSAtIEhpc3TDs3JpY28gZGUgQ1NWHwRnZBQrAAIWCh8ABQ1BY2VpdGUgZGUgQ1NWHwUFEkNTVlxBY2VpdGVDc3YuYXNweB8GBRUuLi9DU1ZcQWNlaXRlQ3N2LmFzcHgfBwUbQ2xpcXVlIGFxdWkgLSBBY2VpdGUgZGUgQ1NWHwRnZBQrAAIWBB8ABRJMYXVkb3MgZGUgVmlzdG9yaWEfBGcUKwAGBRMwOjAsMDoxLDA6MiwwOjMsMDo0FCsAAhYKHwAFEVRlbXBvIGRlIEVtaXNzw6NvHwUFIUxhdWRvc1xDYWRhc3RyYXJDb25maWd1cmFjYW8uYXNweB8GBSQuLi9MYXVkb3NcQ2FkYXN0cmFyQ29uZmlndXJhY2FvLmFzcHgfBwUfQ2xpcXVlIGFxdWkgLSBUZW1wbyBkZSBFbWlzc8Ojbx8EZ2QUKwACFgofAAUSR3J1cG9zIGRlIFZpc3RvcmlhHwUFH0xhdWRvc1xMaXN0YXJHcnVwb1Zpc3RvcmlhLmFzcHgfBgUiLi4vTGF1ZG9zXExpc3RhckdydXBvVmlzdG9yaWEuYXNweB8HBSBDbGlxdWUgYXF1aSAtIEdydXBvcyBkZSBWaXN0b3JpYR8EZ2QUKwACFgofAAURSXRlbnMgZGUgVmlzdG9yaWEfBQUjTGF1ZG9zXExpc3Rhckl0ZW1HcnVwb1Zpc3RvcmlhLmFzcHgfBgUmLi4vTGF1ZG9zXExpc3Rhckl0ZW1HcnVwb1Zpc3RvcmlhLmFzcHgfBwUfQ2xpcXVlIGFxdWkgLSBJdGVucyBkZSBWaXN0b3JpYR8EZ2QUKwACFgofAAUGTGF1ZG9zHwUFGExhdWRvc1xMaXN0YXJMYXVkb3MuYXNweB8GBRsuLi9MYXVkb3NcTGlzdGFyTGF1ZG9zLmFzcHgfBwUUQ2xpcXVlIGFxdWkgLSBMYXVkb3MfBGdkFCsAAhYKHwAFEUxhdWRvcyBBbnRlcmlvcmVzHwUFGUxhdWRvc1xDb25zdWx0YUxhdWRvLmFzcHgfBgUcLi4vTGF1ZG9zXENvbnN1bHRhTGF1ZG8uYXNweB8HBR9DbGlxdWUgYXF1aSAtIExhdWRvcyBBbnRlcmlvcmVzHwRnZBQrAAIWBB8ABQRMb2dzHwRnFCsAAgUDMDowFCsAAhYKHwAFGFJlcXVpc2nDp8O1ZXMgV2ViU2VydmljZR8FBR9Mb2dzXFZpc3VhbGl6YXJMb2dDaGFtYWRhcy5hc3B4HwYFIi4uL0xvZ3NcVmlzdWFsaXphckxvZ0NoYW1hZGFzLmFzcHgfBwUmQ2xpcXVlIGFxdWkgLSBSZXF1aXNpw6fDtWVzIFdlYlNlcnZpY2UfBGdkZAIVD2QWCAIBDw8WBh4IQ3NzQ2xhc3NlHwBlHgRfIVNCAgJkZAIUDxAPFgYeDkRhdGFWYWx1ZUZpZWxkBQNLZXkeDURhdGFUZXh0RmllbGQFBVZhbHVlHgtfIURhdGFCb3VuZGdkEBUHBVRvZG9zBkFjZWl0bwpBZ3VhcmRhbmRvCUJsb3F1ZWFkbwlDYW5jZWxhZG8MRGVzYmxvcXVlYWRvEU7Do28tQ29uZm9ybWlkYWRlFQcAAUEBTgJJQQFEAVEBSRQrAwdnZ2dnZ2dnZGQCFg8PFgQfAAUYNSByZWdpc3Ryb3MgZW5jb250cmFkb3MuHgdWaXNpYmxlZ2RkAhcPPCsADQEADxYEHwxnHgtfIUl0ZW1Db3VudAIFZBYCZg9kFg4CAQ8PFgQfCAUBTh8JAgJkFhJmD2QWAmYPFQEMMDM0NTgzNjk1LTIwZAIBD2QWAmYPFQEHTUNONTM1MmQCAg9kFgJmDxUBEDE3LzA3LzIwMjUgMTY6MTFkAgMPZBYCZg8VAQdQUk9DRURFZAIED2QWAmYPFQEKQWd1YXJkYW5kb2QCBQ9kFgICAQ8PFgIeDU9u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',
            '__VIEWSTATEGENERATOR': '',
            '__EVENTVALIDATION': `/wEWKALvy4beCwLw5ey6BwKZlOu3DAKB+pLZDwKghtrMDQKCna25CwKZ8J7tDQKswJb9AwKVxrfJCQL5iZnDAQKp1t+hCgKihYDuAgL96qqADgLA6qqADgLF6qaeDgL+6qqADgLN6qqADgLF6qqADgLD1r3oCgLem+vWAQLU9LykDQLHjMqDCQLR1evWAQLn8YujDQLAiNmDCQLciuvWAQKWwrCkDQKF2oWDCQLfguvWAQLxuq6kDQLm04ODCQLa+erWAQKAk7SkDQLjq4GDCQLsicWzAQKW5eHnBgLEyquvDQL8/tLDBwKXjpDOBgKunOFzbSo3sNkbMrXGNHULjv8tdb6ASrc=`,
            'ctl00$ContentPlaceDefault$txtPlaca': '',
            'ctl00$ContentPlaceDefault$txtDtStart': '',
            'ctl00$ContentPlaceDefault$txtDtEnd': '',
            'ctl00$ContentPlaceDefault$txtCodigoLaudo': '',
            'ctl00$ContentPlaceDefault$ddlStatus': '',
            'ctl00$ContentPlaceDefault$gvwLaudos$ctl02$lkbVerDetalhes': 'Detalhes',
            'ctl00$ContentPlaceDefault$hfLaudoAceitar': '',
            'ctl00$ContentPlaceDefault$hfLaudoDesbloquear': ''
        })
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const dianteira = `http://denatran4.serpro.gov.br/siscsv/denatranportal2/Laudos/${$('#ctl00_ContentPlaceDefault_imgDianteira').attr('src')}` || 'Não consta';
    const traseira = `http://denatran4.serpro.gov.br/siscsv/denatranportal2/Laudos/${$('#ctl00_ContentPlaceDefault_imgTraseira').attr('src')}` || 'Não consta';
    const panoramica = `http://denatran4.serpro.gov.br/siscsv/denatranportal2/Laudos/${$('#ctl00_ContentPlaceDefault_imgPanoramica').attr('src')}` || 'Não consta';
    const chassi_img = `http://denatran4.serpro.gov.br/siscsv/denatranportal2/Laudos/${$('#ctl00_ContentPlaceDefault_imgChassi').attr('src')}` || 'Não consta';
    const motor_img = `http://denatran4.serpro.gov.br/siscsv/denatranportal2/Laudos/${$('#ctl00_ContentPlaceDefault_imgMotor').attr('src')}` || 'Não consta';
    const documento = `http://denatran4.serpro.gov.br/siscsv/denatranportal2/Laudos/${$('#ctl00_ContentPlaceDefault_imgDocumento').attr('src')}` || 'Não consta';
    const hodometro = `http://denatran4.serpro.gov.br/siscsv/denatranportal2/Laudos/${$('#ctl00_ContentPlaceDefault_imgExtra').attr('src')}` || 'Não consta';

    const fotos = { dianteira, traseira, panoramica, chassi_img, motor_img, documento, hodometro };

    const nome_placa = $('#ctl00_ContentPlaceDefault_txtPlacaBIN').text().trim() || 'Não consta';
    const marca_modelo = $('#ctl00_ContentPlaceDefault_txtMarcaModeloBIN').text().trim() || 'Não consta';
    const tipo_veiculo = $('#ctl00_ContentPlaceDefault_txtTipoVeiculoBIN').text().trim() || 'Não consta';
    const ano_fabricacao = $('#ctl00_ContentPlaceDefault_txtAnoFabricacaoBIN').text().trim() || 'Não consta';
    const ano_modelo = $('#ctl00_ContentPlaceDefault_txtAnoModeloBIN').text().trim() || 'Não consta';
    const cor = $('#ctl00_ContentPlaceDefault_txtAnoModeloBIN').text().trim() || 'Não consta';
    const carrocaria = $('#ctl00_ContentPlaceDefault_txtCarrocariaBIN').text().trim() || 'Não consta';
    const especie = $('#ctl00_ContentPlaceDefault_txtEspecieBIN').text().trim() || 'Não consta';
    const capacidade_de_passageiros = $('#ctl00_ContentPlaceDefault_txtCapacidadePassageirosBIN').text().trim() || 'Não consta';
    const combustivel = $('#ctl00_ContentPlaceDefault_txtCombustivelBIN').text().trim() || 'Não consta';
    const potencia = $('#ctl00_ContentPlaceDefault_txtPotenciaBIN').text().trim() || 'Não consta';
    const cilindradas = $('#ctl00_ContentPlaceDefault_txtCilindradaBIN').text().trim() || 'Não consta';
    const capacidade_de_carga = $('#ctl00_ContentPlaceDefault_txtCapacidadeCargaBIN').text().trim() || 'Não consta';
    const CMT = $('#ctl00_ContentPlaceDefault_txtCMTBIN').text().trim() || 'Não consta';
    const PBT = $('#ctl00_ContentPlaceDefault_txtPBTBIN').text().trim() || 'Não consta';
    const RENAVAM = $('#ctl00_ContentPlaceDefault_txtRENAVAMBin').text().trim() || 'Não consta';
    const data_e_hora = $('#ctl00_ContentPlaceDefault_txtDataHoraBin').text().trim() || 'Não consta';
    const tipo_bin = $('#ctl00_ContentPlaceDefault_txtTipoBIN').text().trim() || 'Não consta';
    const chassi_texto = $('#ctl00_ContentPlaceDefault_txtChassiBIN').text().trim() || 'Não consta';
    const motor_texto = $('#ctl00_ContentPlaceDefault_txtMotorBIN').text().trim() || 'Não consta';
    const eixo = $('#ctl00_ContentPlaceDefault_txtEixoBIN').text().trim() || 'Não consta';
    const cambio = $('#ctl00_ContentPlaceDefault_txtCambioBIN').text().trim() || 'Não consta';
    const carroceria = $('#ctl00_ContentPlaceDefault_txtCarroceriaBIN').text().trim() || 'Não consta';
    const categoria_veiculo = $('#ctl00_ContentPlaceDefault_txtCategoriaVeiculoBIN').text().trim() || 'Não consta';
    const municipio = $('#ctl00_ContentPlaceDefault_txtMunicipioBIN').text().trim() || 'Não consta';
    const UF = $('#ctl00_ContentPlaceDefault_txtUFBIN').text().trim() || 'Não consta';

    const dados_veiculo = { nome_placa, marca_modelo, tipo_veiculo, ano_fabricacao, ano_modelo, cor, carrocaria, especie, capacidade_de_passageiros, combustivel, potencia, cilindradas, capacidade_de_carga, CMT, PBT, RENAVAM, data_e_hora, tipo_bin, chassi_texto, motor_texto, eixo, cambio, carroceria, categoria_veiculo, municipio, UF };

    const data = { dados_veiculo, fotos };

    return data;
};

app.get('/consultar/:laudo', async (req, res) => {
    return res.json(await CodigoLaudoAspx(req.params.laudo));
});

app.listen(port, () => {
    console.log(`===========ROTAS============`);
    console.log(`http://localhost:${port}/consultar/:laudo`);
    console.log(`http://localhost:${port}/listarLaudos/:placa`);
    console.log(`============================`);
});
