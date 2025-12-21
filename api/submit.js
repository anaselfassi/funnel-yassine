export default async function handler(req, res) {
    // 1. إعدادات الحماية (CORS) باش غير الموقع ديالك اللي يقدر يصيفط
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'POST');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. رابط Make.com ديالك (حط الرابط الجديد هنا)
    const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/lkbiaudxzojq3bfv4h7lsonj4v65lrgp';

    if (req.method === 'POST') {
        try {
            // 3. استلام الداتا من الفورم
            const data = req.body;

            // 4. إضافة IP Address وسيط السيرفر (Vercel كيعطيه لينا)
            // هادشي Pro حيت غايعطيك IP الحقيقي ديال الزائر للـ CAPI
            const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            data.ip = clientIp;
            data.user_agent = req.headers['user-agent'];

            console.log("🚀 Server received data:", data);

            // 5. السيرفر هو اللي كيصيفط لـ Make (ماشي المتصفح)
            // السيرفرات مافيهاش AdBlock، يعني الداتا غاتوصل 100%
            const response = await fetch(MAKE_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                return res.status(200).json({ success: true });
            } else {
                return res.status(500).json({ error: 'Make Error' });
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
