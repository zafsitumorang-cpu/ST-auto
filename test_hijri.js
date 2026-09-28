const bulan = ['Muharram','Safar','Rabiul Awal','Rabiul Akhir','Jumadil Awal','Jumadil Akhir','Rajab','Syakban','Ramadan','Syawal','Dzulqadah','Dzulhijjah'];

// KODE LAMA (Intl.DateTimeFormat)
function kodeLama(tgl) {
    const d = new Date(tgl);
    const f = new Intl.DateTimeFormat('en-US-u-ca-islamic', { day:'numeric', month:'numeric', year:'numeric' });
    const parts = f.formatToParts(d);
    let day='', mon='', yr='';
    parts.forEach(p => {
        if (p.type==='day') day=p.value;
        if (p.type==='month') mon=parseInt(p.value,10);
        if (p.type==='year') yr=p.value;
    });
    return day+' '+bulan[mon-1]+' '+yr+' H';
}

// KODE BARU (Tabular Kuwaiti)
function kodeBaru(tgl) {
    const d = new Date(tgl + 'T12:00:00');
    let y = d.getFullYear(), m = d.getMonth() + 1, day = d.getDate();
    let yy = y, mm = m;
    if (mm <= 2) { yy -= 1; mm += 12; }
    const A = Math.floor(yy / 100);
    const B = 2 - A + Math.floor(A / 4);
    const jd = Math.floor(365.25 * (yy + 4716)) + Math.floor(30.6001 * (mm + 1)) + day + B - 1524;
    const days = jd - 1948440;
    const cycle = Math.floor(days / 10631);
    let remaining = days % 10631;
    const leapYears = [false, true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, true, false];
    let hy = cycle * 30 + 1;
    for (let y = 0; y < 30; y++) {
        const yearLen = leapYears[y] ? 355 : 354;
        if (remaining < yearLen) {
            for (let m = 1; m <= 12; m++) {
                let monthLen = (m % 2 === 1) ? 30 : 29;
                if (m === 12 && leapYears[y]) monthLen = 30;
                if (remaining < monthLen) {
                    return { day: remaining + 1, month: m, year: hy };
                }
                remaining -= monthLen;
            }
        }
        remaining -= yearLen;
        hy++;
    }
}

console.log('TANGGAL        | KODE LAMA (Intl)          | KODE BARU (Tabular)');
console.log('-' . repeat(70));
const testDates = ['2026-07-13', '2026-01-01', '2025-07-01', '2024-07-01', '2024-01-01', '2025-01-01'];
for (const tgl of testDates) {
    const lama = kodeLama(tgl);
    const b = kodeBaru(tgl);
    const baruStr = b.day+' '+bulan[b.month-1]+' '+b.year+' H';
    const match = lama === baruStr ? '✓ SAMA' : '✗ BEDA';
    console.log(tgl + ' | ' + lama.padEnd(30) + ' | ' + baruStr.padEnd(30) + ' | ' + match);
}
