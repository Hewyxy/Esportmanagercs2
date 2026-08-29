const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
    res.json({
        message: "Hello from Backend!",
        status: "success"
    });
});


app.get("/api/players", (req, res) => {
    res.json(
    [
        {
            id: 1, 
            name: "donk", 
            role: "Rifler", 
            rating: 1.46, 
            team: "Spirit", 
            image:"https://img-cdn.hltv.org/playerbodyshot/yovIrLe65oyvKxFkIoHLCw.png?ixlib=java-2.1.0&w=400&s=8004b2014a729345713bf22c5b798274", 
            teamImage: "https://img-cdn.hltv.org/teamlogo/ywdn4tmAvXfllLeV2SkkvF.png?ixlib=java-2.1.0&w=100&s=e441b77b1cafbca20ba9f667caca56f4" 
        },
        {
            id: 2, 
            name: "zont1x", 
            role: "Rifler", 
            rating: 1.00, 
            team: "Spirit", 
            image:"https://img-cdn.hltv.org/playerbodyshot/Z1p6r4ccCtZVGSyrYhI55u.png?ixlib=java-2.1.0&w=400&s=2b339fae86806e62359925ab6e03a6db",
            teamImage: "https://img-cdn.hltv.org/teamlogo/ywdn4tmAvXfllLeV2SkkvF.png?ixlib=java-2.1.0&w=100&s=e441b77b1cafbca20ba9f667caca56f4" 
        },
        {
            id: 3, 
            name: "tN1R", 
            role: "Rifler", 
            rating: 1.02, 
            team: "Spirit", 
            image:"https://img-cdn.hltv.org/playerbodyshot/-8byEUxJfnSNJ0geF3s3-m.png?ixlib=java-2.1.0&w=400&s=ea20bf18efa6106a9e39423848916017", 
            teamImage: "https://img-cdn.hltv.org/teamlogo/ywdn4tmAvXfllLeV2SkkvF.png?ixlib=java-2.1.0&w=100&s=e441b77b1cafbca20ba9f667caca56f4" 
        },
        {
            id: 4, 
            name: "magixx", 
            role: "IGL", 
            rating: 0.97, 
            team: "Spirit", 
            image:"https://img-cdn.hltv.org/playerbodyshot/GEpLRsAE-81c04QrPMzLdo.png?ixlib=java-2.1.0&w=400&s=a0125720fb99be0a85306f2697a95404", 
            teamImage: "https://img-cdn.hltv.org/teamlogo/ywdn4tmAvXfllLeV2SkkvF.png?ixlib=java-2.1.0&w=100&s=e441b77b1cafbca20ba9f667caca56f4" 
        },
        {
            id: 5, 
            name: "sh1ro", 
            role: "Sniper", 
            rating: 1.16, 
            team: "Spirit", 
            image:"https://img-cdn.hltv.org/playerbodyshot/x6VrTcb7cbuzLy_btI62PY.png?ixlib=java-2.1.0&w=400&s=0039f833b84d47654049b65a017efd8a", 
            teamImage: "https://img-cdn.hltv.org/teamlogo/ywdn4tmAvXfllLeV2SkkvF.png?ixlib=java-2.1.0&w=100&s=e441b77b1cafbca20ba9f667caca56f4" 
        },
        
    ]);
});



app.listen(3000, () => {
    console.log("Backend running on http://localhost:3000");
});