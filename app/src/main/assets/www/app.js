/*==== 物理掌中学 - 核心逻辑（题库扩充 + AI答疑）====*/
const $ = (s, ctx) => (ctx || document).querySelector(s);
const $$ = (s, ctx) => Array.prototype.slice.call((ctx || document).querySelectorAll(s));

// ===== 学段定义（Key严格隔离，修复八年级跳高一）=====
const STAGES = {
  "c7": "七年级", "c8": "八年级", "c9": "九年级",
  "c10": "高一必修一", "c11": "高一必修二", "c12": "高二"
};

// ===== 章节数据 =====
const CHAPTERS = [
  { id: "7-01", s: "c7", t: "走进物理世界", k: ["长度测量","时间测量","科学探究"] },
  { id: "8-01", s: "c8", t: "机械运动", k: ["参照物","速度计算","匀速直线运动"] },
  { id: "8-02", s: "c8", t: "声现象", k: ["声音产生","声音传播","回声测距"] },
  { id: "8-03", s: "c8", t: "物态变化", k: ["熔化凝固","汽化液化","升华凝华"] },
  { id: "8-04", s: "c8", t: "光现象", k: ["光的反射","光的折射","透镜成像"] },
  { id: "8-05", s: "c8", t: "质量与密度", k: ["质量测量","密度计算","密度应用"] },
  { id: "9-01", s: "c9", t: "内能", k: ["分子热运动","内能","比热容"] },
  { id: "9-02", s: "c9", t: "电路基础", k: ["电荷","电流","电压","电阻"] },
  { id: "9-03", s: "c9", t: "欧姆定律", k: ["欧姆定律","串并联电路","伏安法"] },
  { id: "10-01", s: "c10", t: "牛顿运动定律", k: ["牛顿第一定律","牛顿第二定律","牛顿第三定律"] },
  { id: "10-02", s: "c10", t: "匀变速直线运动", k: ["加速度","v-t图像","自由落体"] },
  { id: "10-03", s: "c10", t: "相互作用力", k: ["重力","弹力","摩擦力","受力分析"] },
  { id: "11-01", s: "c11", t: "曲线运动", k: ["平抛运动","圆周运动","万有引力"] },
  { id: "11-02", s: "c11", t: "机械能", k: ["功","功率","动能定理","机械能守恒"] },
  { id: "12-01", s: "c12", t: "电场", k: ["电场强度","电势","电容"] },
  { id: "12-02", s: "c12", t: "电磁感应", k: ["磁通量","楞次定律","法拉第定律"] }
];

// ===== 题库（每章 3~4 题，覆盖基础→进阶）=====
const QUESTIONS = [
  // 7-01 走进物理世界
  { id:"q7001", cid:"7-01", mod:"声光基础", tag:"测量", lv:1, q:"下列测量中，属于长度测量工具的是？", opts:["秒表","刻度尺","天平","温度计"], ans:1, exp:"刻度尺是长度测量工具；秒表测时间，天平测质量，温度计测温度。" },
  { id:"q7002", cid:"7-01", mod:"声光基础", tag:"误差", lv:1, q:"关于误差，下列说法正确的是？", opts:["误差就是错误","多次测量求平均可减小误差","误差可以避免","使用精密仪器能消除误差"], ans:1, exp:"误差不可避免，只能减小；多次测量取平均值是常用减小方法。" },
  { id:"q7003", cid:"7-01", mod:"声光基础", tag:"单位", lv:1, q:"某同学身高 165，合适的单位是？", opts:["m","dm","cm","mm"], ans:2, exp:"中学生身高约 1.65m = 165cm，故填 cm。" },
  { id:"q7004", cid:"7-01", mod:"声光基础", tag:"测量", lv:2, q:"用刻度尺测物体长度，读数为 3.42cm，其中估读位是？", opts:["3","4","2","没有估读"], ans:2, exp:"刻度尺读数要估读到分度值下一位，末位 2 是估读位。" },

  // 8-01 机械运动
  { id:"q8001", cid:"8-01", mod:"力学", tag:"参照物", lv:1, q:"关于参照物，下列说法正确的是？", opts:["只有静止的物体才能做参照物","只有运动的物体才能做参照物","参照物可以任意选择","参照物必须是地面"], ans:2, exp:"参照物可任意选择，静止或运动的物体均可。" },
  { id:"q8002", cid:"8-01", mod:"力学", tag:"速度", lv:1, q:"汽车以 20m/s 匀速行驶，5s 内通过的路程是？", opts:["4m","25m","100m","200m"], ans:2, exp:"s=vt=20×5=100m。" },
  { id:"q8003", cid:"8-01", mod:"力学", tag:"速度", lv:2, q:"某物体前一半路程速度 v1，后一半速度 v2，全程平均速度是？", opts:["(v1+v2)/2","2v1v2/(v1+v2)","v1v2/(v1+v2)","无法确定"], ans:1, exp:"等路程平均速度 = 2v1v2/(v1+v2)，是调和平均不是算术平均。" },
  { id:"q8004", cid:"8-01", mod:"力学", tag:"参照物", lv:1, q:"“两岸青山相对出”所选参照物是？", opts:["青山","船","河岸","太阳"], ans:1, exp:"青山“相对出”是以运动的船为参照物。" },

  // 8-02 声现象
  { id:"q8101", cid:"8-02", mod:"声光基础", tag:"声音产生", lv:1, q:"声音是由物体的什么产生的？", opts:["振动","运动","摩擦","碰撞"], ans:0, exp:"声音由物体振动产生，振动停止发声停止。" },
  { id:"q8102", cid:"8-02", mod:"声光基础", tag:"声音传播", lv:1, q:"声音不能在下列哪种环境中传播？", opts:["空气","水","钢铁","真空"], ans:3, exp:"声音传播需要介质，真空不能传声。" },
  { id:"q8103", cid:"8-02", mod:"声光基础", tag:"声音特性", lv:2, q:"“闻其声而知其人”主要依据声音的？", opts:["音调","响度","音色","频率"], ans:2, exp:"不同人音色不同，据此辨人。" },
  { id:"q8104", cid:"8-02", mod:"声光基础", tag:"回声", lv:2, q:"对着山崖喊话，2s 后听到回声，人距山崖约？(声速340m/s)", opts:["170m","340m","680m","85m"], ans:1, exp:"声音往返 2s，单程 1s，s=340×1=340m。" },

  // 8-03 物态变化
  { id:"q8201", cid:"8-03", mod:"热学", tag:"熔化", lv:1, q:"冰熔化成水的过程中，温度？", opts:["升高","不变","降低","先升后降"], ans:1, exp:"晶体熔化时吸热但温度保持在熔点不变。" },
  { id:"q8202", cid:"8-03", mod:"热学", tag:"汽化", lv:1, q:"下列属于液化现象的是？", opts:["湿衣服变干","露珠形成","樟脑丸变小","冰化成水"], ans:1, exp:"露珠是水蒸气遇冷液化成的小水滴。" },
  { id:"q8203", cid:"8-03", mod:"热学", tag:"升华", lv:2, q:"冬天冰冻的衣服也会变干，属于？", opts:["熔化","汽化","升华","凝华"], ans:2, exp:"冰直接变成水蒸气，是升华。" },
  { id:"q8204", cid:"8-03", mod:"热学", tag:"蒸发", lv:2, q:"下列能加快液体蒸发的是？", opts:["降低温度","减小表面积","加快液面上方空气流动","密封容器"], ans:2, exp:"加快空气流动、升温、增大表面积都能加快蒸发。" },

  // 8-04 光现象
  { id:"q8301", cid:"8-04", mod:"声光基础", tag:"光的反射", lv:1, q:"入射光线与镜面夹角 30°，反射角是？", opts:["30°","60°","90°","120°"], ans:1, exp:"入射角=90°-30°=60°，反射角等于入射角=60°。" },
  { id:"q8302", cid:"8-04", mod:"声光基础", tag:"光的折射", lv:1, q:"筷子插入水中看起来弯折，是光的？", opts:["直线传播","反射","折射","色散"], ans:2, exp:"光从水射入空气发生折射，使筷子看起来弯折。" },
  { id:"q8303", cid:"8-04", mod:"声光基础", tag:"透镜", lv:2, q:"凸透镜成倒立缩小实像时，物距 u 满足？", opts:["u<f","f<u<2f","u=2f","u>2f"], ans:3, exp:"u>2f 时成倒立缩小实像（照相机原理）。" },
  { id:"q8304", cid:"8-04", mod:"声光基础", tag:"光的反射", lv:1, q:"我们能从各个方向看到不发光的物体，是因为？", opts:["镜面反射","漫反射","折射","直线传播"], ans:1, exp:"漫反射使光射向各个方向，故能从不同角度看到。" },

  // 8-05 质量与密度
  { id:"q8401", cid:"8-05", mod:"力学", tag:"密度计算", lv:1, q:"水的密度是？", opts:["1 g/cm³","10 g/cm³","0.1 g/cm³","100 g/cm³"], ans:0, exp:"ρ水=1.0×10³kg/m³=1 g/cm³。" },
  { id:"q8402", cid:"8-05", mod:"力学", tag:"密度计算", lv:2, q:"质量相同的铁块和铝块(ρ铁>ρ铝)，体积较大的是？", opts:["铁块","铝块","一样大","无法判断"], ans:1, exp:"V=m/ρ，质量相同时密度小的体积大，故铝块大。" },
  { id:"q8403", cid:"8-05", mod:"力学", tag:"质量测量", lv:1, q:"使用天平称量前，应先将游码移到？", opts:["中间","标尺左端零刻度线","右端","任意位置"], ans:1, exp:"称量前游码归零，再调平衡螺母使横梁平衡。" },
  { id:"q8404", cid:"8-05", mod:"力学", tag:"密度应用", lv:3, q:"一瓶子装满水总质量 500g，装满酒精(0.8g/cm³)总质量 420g，瓶子质量是？(水1g/cm³)", opts:["100g","200g","300g","80g"], ans:0, exp:"设瓶质量 m、容积 V：m+1.0V=500，m+0.8V=420。两式相减 0.2V=80，V=400cm³，代入得 m=500−400=100g。" },

  // 9-01 内能
  { id:"q9001", cid:"9-01", mod:"热学", tag:"分子热运动", lv:1, q:"扩散现象说明？", opts:["分子静止","分子在不停地做无规则运动","分子间无间隙","分子很大"], ans:1, exp:"扩散表明分子在永不停息地做无规则运动。" },
  { id:"q9002", cid:"9-01", mod:"热学", tag:"比热容", lv:2, q:"水的比热容较大，带来的现象是？", opts:["沿海地区昼夜温差小","沙漠昼夜温差小","水升温快","水不易吸热"], ans:0, exp:"水比热容大，吸放同热量温度变化小，故沿海温差小。" },
  { id:"q9003", cid:"9-01", mod:"热学", tag:"内能", lv:2, q:"改变物体内能的方式有？", opts:["只有做功","只有热传递","做功和热传递","都不对"], ans:2, exp:"做功和热传递都能改变内能，二者等效。" },

  // 9-02 电路基础
  { id:"q9101", cid:"9-02", mod:"电磁学", tag:"电流", lv:1, q:"电流的方向规定为？", opts:["电子移动方向","正电荷定向移动方向","负电荷移动方向","任意方向"], ans:1, exp:"规定正电荷定向移动方向为电流方向。" },
  { id:"q9102", cid:"9-02", mod:"电磁学", tag:"电路", lv:1, q:"下列是完整电路必不可少的是？", opts:["开关","电源、用电器、导线、开关","灯泡","电流表"], ans:1, exp:"完整电路需电源、用电器、导线和开关四部分。" },
  { id:"q9103", cid:"9-02", mod:"电磁学", tag:"串并联", lv:2, q:"家庭电路中各用电器之间是？", opts:["串联","并联","混联","都不对"], ans:1, exp:"家庭电路用电器并联，互不影响且电压均为220V。" },

  // 9-03 欧姆定律
  { id:"q9201", cid:"9-03", mod:"电磁学", tag:"欧姆定律", lv:1, q:"欧姆定律表达式是？", opts:["U=IR","I=U/R","R=UI","P=UI"], ans:1, exp:"I=U/R，电流与电压成正比、与电阻成反比。" },
  { id:"q9202", cid:"9-03", mod:"电磁学", tag:"欧姆定律", lv:2, q:"某电阻两端电压 6V 时电流 0.3A，其阻值为？", opts:["2Ω","18Ω","20Ω","0.05Ω"], ans:2, exp:"R=U/I=6/0.3=20Ω。" },
  { id:"q9203", cid:"9-03", mod:"电磁学", tag:"串联", lv:2, q:"两个电阻串联，总电阻比其中任何一个都？", opts:["大","小","相等","不一定"], ans:0, exp:"串联总电阻 R=R1+R2，比任一电阻都大。" },

  // 10-01 牛顿运动定律
  { id:"q10001", cid:"10-01", mod:"力学", tag:"牛顿第一定律", lv:1, q:"牛顿第一定律又叫？", opts:["加速度定律","惯性定律","作用反作用定律","万有引力定律"], ans:1, exp:"牛顿第一定律揭示惯性，故称惯性定律。" },
  { id:"q10002", cid:"10-01", mod:"力学", tag:"牛顿第二定律", lv:2, q:"F=ma 中的 F 指的是？", opts:["某个力","重力","合力","摩擦力"], ans:2, exp:"F 为物体所受合外力。" },
  { id:"q10003", cid:"10-01", mod:"力学", tag:"牛顿第二定律", lv:2, q:"质量 2kg 物体受 6N 合力，加速度为？", opts:["2m/s²","3m/s²","4m/s²","12m/s²"], ans:1, exp:"a=F/m=6/2=3m/s²。" },
  { id:"q10004", cid:"10-01", mod:"力学", tag:"牛顿第三定律", lv:2, q:"作用力与反作用力的特点是？", opts:["平衡力","大小相等方向相反作用在同物体","大小相等方向相反作用在不同物体","方向相同"], ans:2, exp:"作用力与反作用力等大反向、共线，但作用在两个不同物体上。" },

  // 10-02 匀变速直线运动
  { id:"q10101", cid:"10-02", mod:"力学", tag:"加速度", lv:1, q:"加速度描述的是？", opts:["运动快慢","速度变化快慢","位移大小","时间"], ans:1, exp:"加速度 a=Δv/Δt，描述速度变化的快慢。" },
  { id:"q10102", cid:"10-02", mod:"力学", tag:"自由落体", lv:1, q:"自由落体运动的初速度和加速度？", opts:["v0=0,a=0","v0=0,a=g","v0≠0,a=g","v0=0,a=2g"], ans:1, exp:"自由落体初速为0，加速度为重力加速度 g。" },
  { id:"q10103", cid:"10-02", mod:"力学", tag:"v-t图像", lv:2, q:"v-t 图像中，图线的斜率表示？", opts:["位移","加速度","速度","时间"], ans:1, exp:"v-t 图斜率 k=Δv/Δt=a，即加速度。" },
  { id:"q10104", cid:"10-02", mod:"力学", tag:"匀变速", lv:3, q:"物体由静止匀加速，3s 末速度 6m/s，加速度为？", opts:["1m/s²","2m/s²","3m/s²","18m/s²"], ans:1, exp:"a=(v-v0)/t=(6-0)/3=2m/s²。" },

  // 10-03 相互作用力
  { id:"q10201", cid:"10-03", mod:"力学", tag:"重力", lv:1, q:"重力的方向总是？", opts:["垂直向下","竖直向下","指向地心以外","水平"], ans:1, exp:"重力方向竖直向下（近似指向地心）。" },
  { id:"q10202", cid:"10-03", mod:"力学", tag:"摩擦力", lv:2, q:"滑动摩擦力的大小与什么有关？", opts:["接触面积","速度和面积","压力和接触面粗糙程度","只与压力"], ans:2, exp:"f=μN，与正压力和动摩擦因数（粗糙程度）有关。" },
  { id:"q10203", cid:"10-03", mod:"力学", tag:"弹力", lv:1, q:"弹力的产生条件是？", opts:["接触即可","接触且发生弹性形变","发生形变即可","相互吸引"], ans:1, exp:"弹力需直接接触且发生弹性形变。" },
  { id:"q10204", cid:"10-03", mod:"力学", tag:"受力分析", lv:3, q:"静止在斜面上的物块，一定受到的力是？", opts:["重力、支持力、下滑力","重力、支持力、静摩擦力","重力、压力","只有重力"], ans:1, exp:"受重力、斜面支持力，以及平衡下滑趋势的静摩擦力。" },

  // 11-01 曲线运动
  { id:"q11001", cid:"11-01", mod:"力学", tag:"平抛运动", lv:2, q:"平抛运动可分解为？", opts:["水平匀速+竖直自由落体","水平加速+竖直匀速","两个匀加速","匀速圆周"], ans:0, exp:"平抛：水平方向匀速直线，竖直方向自由落体。" },
  { id:"q11002", cid:"11-01", mod:"力学", tag:"圆周运动", lv:2, q:"做匀速圆周运动的物体，下列不变的是？", opts:["速度","速率(速度大小)","加速度","合外力方向"], ans:1, exp:"匀速圆周运动速率不变，但速度方向、加速度方向时刻改变。" },
  { id:"q11003", cid:"11-01", mod:"力学", tag:"万有引力", lv:2, q:"万有引力定律中，引力与距离的？", opts:["成正比","平方成正比","平方成反比","无关"], ans:2, exp:"F=GMm/r²，引力与距离平方成反比。" },

  // 11-02 机械能
  { id:"q11101", cid:"11-02", mod:"力学", tag:"功", lv:1, q:"做功的两个必要因素是？", opts:["力和时间","力和沿力方向的位移","速度和位移","功率和时间"], ans:1, exp:"W=Fs·cosθ，需有力且有沿力方向的位移。" },
  { id:"q11102", cid:"11-02", mod:"力学", tag:"功率", lv:1, q:"功率的物理意义是？", opts:["做功多少","做功快慢","力的大小","能量多少"], ans:1, exp:"P=W/t，表示做功的快慢。" },
  { id:"q11103", cid:"11-02", mod:"力学", tag:"动能定理", lv:2, q:"动能定理的内容是？", opts:["合外力做功等于动能变化","重力做功等于势能变化","机械能守恒","动量守恒"], ans:0, exp:"合外力对物体做的功等于物体动能的变化量。" },
  { id:"q11104", cid:"11-02", mod:"力学", tag:"机械能守恒", lv:3, q:"只有重力做功时，物体的？", opts:["动能不变","势能不变","机械能守恒","动量守恒"], ans:2, exp:"只有重力(或弹力)做功时，机械能守恒。" },

  // 12-01 电场
  { id:"q12001", cid:"12-01", mod:"电磁学", tag:"电场强度", lv:2, q:"电场强度 E 的定义式是？", opts:["E=F/q","E=kQ/r","E=Ud","E=qF"], ans:0, exp:"E=F/q，电场强度等于试探电荷所受电场力与其电量之比。" },
  { id:"q12002", cid:"12-01", mod:"电磁学", tag:"电场线", lv:1, q:"电场线的疏密表示？", opts:["电势高低","场强大小","电荷多少","方向"], ans:1, exp:"电场线越密处场强越大。" },
  { id:"q12003", cid:"12-01", mod:"电磁学", tag:"电容", lv:2, q:"电容器电容的单位是？", opts:["伏特(V)","法拉(F)","库仑(C)","欧姆(Ω)"], ans:1, exp:"电容单位是法拉 F。" },

  // 12-02 电磁感应
  { id:"q12101", cid:"12-02", mod:"电磁学", tag:"法拉第定律", lv:2, q:"感应电动势的大小与磁通量的？", opts:["大小成正比","变化率成正比","变化量成反比","方向有关"], ans:1, exp:"E=n·ΔΦ/Δt，感应电动势与磁通量变化率成正比。" },
  { id:"q12102", cid:"12-02", mod:"电磁学", tag:"楞次定律", lv:3, q:"楞次定律说明感应电流的磁场总是？", opts:["增强原磁通","阻碍引起它的磁通量变化","与原磁场同向","无规律"], ans:1, exp:"感应电流的磁场总要阻碍引起感应电流的磁通量变化。" },
  { id:"q12103", cid:"12-02", mod:"电磁学", tag:"磁通量", lv:1, q:"磁通量的单位是？", opts:["特斯拉(T)","韦伯(Wb)","亨利(H)","伏特(V)"], ans:1, exp:"磁通量单位韦伯 Wb，1Wb=1T·m²。" }
];

// ===== AI 答疑：本地知识库（离线可用）=====
// 每条：keywords 命中词，title 标题，body 讲解，formula 可选公式，tip 易错点
const AI_KB = [
  { keywords:["牛顿第二定律","F=ma","加速度","合外力"], title:"牛顿第二定律",
    body:"物体的加速度与所受合外力成正比、与质量成反比，方向与合外力方向相同。它是联系力与运动的桥梁。",
    formula:"F合 = m·a", tip:"F 一定是合外力，a 与 F合 方向始终一致；不要把某个分力直接代入。" },
  { keywords:["牛顿第一定律","惯性","惯性定律"], title:"牛顿第一定律与惯性",
    body:"一切物体在不受外力（或合外力为零）时，总保持静止或匀速直线运动状态。惯性只与质量有关，质量越大惯性越大。",
    formula:"", tip:"惯性不是力，不能说‘受到惯性作用’；速度大不代表惯性大。" },
  { keywords:["摩擦力","滑动摩擦","静摩擦","μ"], title:"摩擦力",
    body:"滑动摩擦力 f=μN，与正压力和接触面粗糙程度有关，与接触面积、速度无关。静摩擦力大小随外力变化，最大为最大静摩擦力。",
    formula:"f = μN", tip:"N 是正压力不一定等于重力；斜面上 N=mg·cosθ。" },
  { keywords:["速度","平均速度","匀速","参照物","路程"], title:"机械运动与速度",
    body:"速度 v=s/t 描述运动快慢。平均速度=总路程/总时间。判断运动要先选参照物，运动和静止是相对的。",
    formula:"v = s / t", tip:"等路程往返的平均速度是调和平均 2v1v2/(v1+v2)，不是 (v1+v2)/2。" },
  { keywords:["密度","质量","体积","浮力","ρ"], title:"质量与密度",
    body:"密度 ρ=m/V 是物质特性，与质量体积无关。同种物质密度一定，可用来鉴别物质、计算不便称量的质量或体积。",
    formula:"ρ = m / V", tip:"水 ρ=1g/cm³=1.0×10³kg/m³；气体密度随温度压强变化明显。" },
  { keywords:["欧姆定律","电阻","电流","电压","电路","串联","并联"], title:"欧姆定律与电路",
    body:"I=U/R：电流与电压成正比、与电阻成反比。串联电流处处相等、总电阻 R=R1+R2；并联各支路电压相等、1/R=1/R1+1/R2。",
    formula:"I = U / R", tip:"电阻是导体本身属性，不随 U、I 改变；R=U/I 只是计算式。" },
  { keywords:["光的反射","反射角","入射角","平面镜"], title:"光的反射",
    body:"反射定律：反射光线、入射光线、法线在同一平面，反射角等于入射角。注意角度是相对法线而非镜面。",
    formula:"∠反射 = ∠入射", tip:"题目给‘与镜面夹角’时先换成与法线夹角：入射角=90°−该夹角。" },
  { keywords:["光的折射","折射","透镜","凸透镜","成像","焦距"], title:"光的折射与透镜成像",
    body:"光从一种介质斜射入另一种介质时传播方向偏折。凸透镜：u>2f 成倒立缩小实像(照相机)，f<u<2f 成倒立放大实像(投影仪)，u<f 成正立放大虚像(放大镜)。",
    formula:"1/u + 1/v = 1/f", tip:"分清实像(能承接到光屏、倒立)与虚像(不能承接、正立)。" },
  { keywords:["物态变化","熔化","凝固","汽化","液化","升华","凝华","蒸发","沸腾"], title:"物态变化",
    body:"六种物态变化：熔化/凝固、汽化/液化、升华/凝华。晶体熔化、液体沸腾时吸热但温度不变。蒸发在任何温度都能进行，且吸热致冷。",
    formula:"", tip:"‘白气’是小液滴(液化)不是水蒸气；水蒸气是无色看不见的。" },
  { keywords:["比热容","内能","热量","热传递","分子","扩散","温度"], title:"内能与比热容",
    body:"分子在永不停息地做无规则运动(扩散可证明)。改变内能两种方式：做功和热传递。Q=cmΔt，水比热容大，吸放热时温度变化小。",
    formula:"Q = c·m·Δt", tip:"温度、热量、内能三者别混：温度是状态量，热量是过程量，不能说‘含有热量’。" },
  { keywords:["机械能","动能","势能","功","功率","动能定理","守恒"], title:"功、功率与机械能",
    body:"W=Fs·cosθ，P=W/t。动能定理：合外力做功等于动能变化。只有重力(弹力)做功时机械能守恒。",
    formula:"W=Fs·cosθ  P=W/t", tip:"有力无位移、或力与位移垂直时该力不做功。" },
  { keywords:["电场","电场强度","电场线","电势","电容","库仑"], title:"电场基础",
    body:"E=F/q 描述电场强弱，方向为正电荷受力方向。电场线密处场强大，沿电场线电势降低。电容 C=Q/U，单位法拉(F)。",
    formula:"E = F / q", tip:"E 由场源决定，与试探电荷 q 无关；别把 E=F/q 与 E=kQ/r² 的适用范围搞混。" },
  { keywords:["电磁感应","磁通量","楞次","法拉第","感应电流","感应电动势"], title:"电磁感应",
    body:"闭合回路磁通量变化时产生感应电流。法拉第定律 E=n·ΔΦ/Δt，感应电动势与磁通量变化率成正比。楞次定律：感应电流的磁场阻碍原磁通量变化。",
    formula:"E = n·ΔΦ/Δt", tip:"‘阻碍变化’不是‘阻止’；磁通量最大时变化率可能为零(如线圈平面垂直磁场瞬间)。" },
  { keywords:["平抛","曲线运动","圆周运动","万有引力","向心"], title:"曲线运动与万有引力",
    body:"平抛可分解为水平匀速+竖直自由落体。匀速圆周运动速率不变但速度方向变，有向心加速度。万有引力 F=GMm/r²，与距离平方成反比。",
    formula:"F = G·Mm / r²", tip:"圆周运动‘匀速’指速率不变，速度、加速度都是变化的(方向变)。" },
  { keywords:["自由落体","匀变速","加速度","v-t","位移公式"], title:"匀变速直线运动",
    body:"加速度 a=Δv/Δt 描述速度变化快慢。常用公式：v=v0+at，s=v0t+½at²，v²−v0²=2as。自由落体 v0=0、a=g。v-t 图斜率是加速度、面积是位移。",
    formula:"v=v0+at  s=v0t+½at²", tip:"注意正方向约定，减速时 a 与 v 反号；别漏掉初速度。" },
  { keywords:["声","声音","音调","响度","音色","回声","振动"], title:"声现象",
    body:"声音由振动产生，需介质传播，真空不能传声。三特性：音调(频率)、响度(振幅)、音色(发声体材料结构，用于辨人辨物)。回声测距 s=vt/2。",
    formula:"s = v·t / 2", tip:"回声时间 t 是往返时间，算距离要除以 2；15℃空气中声速约 340m/s。" }
];

// 兜底回答
const AI_FALLBACK = "我是「物理掌中学」AI 助教。这个问题我暂时没有匹配的知识点，你可以换个说法，或试试问：\n· 牛顿第二定律怎么用\n· 摩擦力和什么有关\n· 凸透镜成像规律\n· 欧姆定律\n·  平抛运动怎么分解";

function aiAnswer(text){
  const t = (text||"").toLowerCase();
  let best = null, bestScore = 0;
  AI_KB.forEach(item => {
    let score = 0;
    item.keywords.forEach(k => { if (t.includes(k.toLowerCase())) score += k.length; });
    if (score > bestScore) { bestScore = score; best = item; }
  });
  if (!best || bestScore === 0) return { title:"", body: AI_FALLBACK, formula:"", tip:"" };
  return best;
}

// ===== 全局状态 =====
const store = window.store = {
  stage: "c8", currentChapter: null,
  quizList: [], quizIdx: 0, quizScore: 0, answered: false,
  errors: [], records: [], chatMsgs: [], streak: 8, totalDone: 0, correctRate: 0
};

// ===== 路由 =====
const routes = {
  home: () => renderHome(),
  knowledge: () => renderKnowledge(),
  chapter: (cid) => { const c = CHAPTERS.find(x => x.id === cid); if(c) store.stage = c.s; store.currentChapter = cid; renderChapter(cid); },
  practice: (cid) => startQuiz(cid),
  ai: () => renderAI(),
  profile: () => renderProfile()
};
let historyStack = [];
function navigate(name, param){ historyStack.push(store._current||"home"); routes[name](param); go(name); }
function go(page){
  $$(".page").forEach(p => p.classList.toggle("active", p.id === "page-"+page));
  $$(".tab").forEach(t => t.classList.toggle("on", t.dataset.tab === page));
  store._current = page;
}
function back(){ const prev = historyStack.pop()||"home"; routes[prev](); go(prev); }

// ===== 首页 =====
function renderHome(){
  const byStage = CHAPTERS.reduce((a,c)=>{ (a[c.s]=a[c.s]||[]).push(c); return a; },{});
  const cards = Object.keys(byStage).map(s => {
    const list = byStage[s].slice(0,3);
    return `<div class="card">
      <div class="card-head"><div class="h">${STAGES[s]}</div><div class="more">共${byStage[s].length}章</div></div>
      ${list.map((c,i)=>`<div class="chapter" data-act="chapter:${c.id}"><div class="num">${String(i+1).padStart(2,'0')}</div><div class="mid"><div class="t">${c.t}</div><div class="bar"><i style="width:${30+i*20}%"></i></div></div><div class="arrow">›</div></div>`).join("")}
    </div>`;
  }).join("");
  $("#page-home").innerHTML = `<div class="content">
    <div class="card" style="background:linear-gradient(135deg,#2E86DE,#1a5fa8);color:#fff">
      <div style="font-size:20px;font-weight:700">物理掌中学</div>
      <div style="font-size:13px;opacity:.85;margin-top:4px">连续学习 ${store.streak} 天 · 正确率 ${store.correctRate}% · 题库 ${QUESTIONS.length} 题</div>
    </div>
    <div class="grid4" style="margin:12px 0">
      ${entry("📖","知识体系","blue","knowledge")}
      ${entry("📝","同步练习","mint","practice")}
      ${entry("🤖","AI答疑","orange","ai")}
      ${entry("👤","我的","purple","profile")}
    </div>
    <div class="card-head"><div class="h">知识体系</div></div>
    ${cards}
  </div>`;
}
function entry(icon,t,cls,act){
  const bg={blue:"var(--blue-bg)",mint:"var(--mint-bg)",purple:"var(--purple-bg)",orange:"var(--orange-bg)"}[cls];
  return `<div class="gitem" data-act="${act}"><div class="ico" style="background:${bg}">${icon}</div><div class="t">${t}</div></div>`;
}

// ===== 知识体系页 =====
function renderKnowledge(){
  const seg = Object.keys(STAGES).map(s=>`<button data-s="${s}" class="${s===store.stage?'on':''}">${STAGES[s]}</button>`).join("");
  const list = CHAPTERS.filter(c=>c.s===store.stage).map((c,i)=>
    `<div class="chapter" data-act="chapter:${c.id}"><div class="num">${String(i+1).padStart(2,'0')}</div><div class="mid"><div class="t">${c.t}</div><div class="tags">${c.k.map(k=>`<span class="tag">${k}</span>`).join("")}</div></div><div class="arrow">›</div></div>`
  ).join("");
  $("#page-knowledge").innerHTML = `<div class="content">
    <div class="topbar"><div class="title">知识体系</div><div class="subtitle">初高中物理全覆盖</div></div>
    <div class="seg">${seg}</div>
    <div class="card">${list || '<div class="empty"><div class="e">📚</div><div>该学段暂无内容</div></div>'}</div>
  </div>`;
}

// ===== 章节详情 =====
function renderChapter(cid){
  const c = CHAPTERS.find(x=>x.id===cid); if(!c) return;
  const qs = QUESTIONS.filter(q=>q.cid===cid);
  $("#page-chapter").innerHTML = `<div class="content">
    <div class="topbar"><div class="title">${c.t}</div><div class="subtitle">${STAGES[c.s]} · ${c.k.length}个知识点 · ${qs.length}道题</div></div>
    <div class="card"><div class="card-head"><div class="h">知识点</div></div><div class="tags">${c.k.map(k=>`<span class="tag">${k}</span>`).join("")}</div></div>
    <div class="card"><div class="card-head"><div class="h">章节练习</div><div class="more" data-act="practice:${cid}">全部 ${qs.length} 题 ›</div></div>
      ${qs.length ? qs.slice(0,4).map(q=>`<div class="chapter" data-act="doq:${q.id}"><div class="mid"><div class="t" style="font-size:13px">${q.q}</div></div><div class="arrow">›</div></div>`).join("") : '<div class="empty"><div class="e">📝</div><div>暂无题目</div></div>'}
    </div>
    <button class="btn btn-primary" data-act="practice:${cid}" style="margin-top:8px">开始本章练习</button>
    <button class="btn btn-ghost" data-act="back" style="margin-top:8px">返回</button>
  </div>`;
  go("chapter");
}

// ===== 练习 =====
function startQuiz(listOrCid, singleQid){
  let list;
  if(singleQid){ list=[QUESTIONS.find(q=>q.id===singleQid)]; }
  else if(Array.isArray(listOrCid)){ list=listOrCid.length?listOrCid:QUESTIONS.slice(); }
  else if(typeof listOrCid==="string"){ list=QUESTIONS.filter(q=>q.cid===listOrCid); }
  else { list=QUESTIONS.slice(); }
  if(!list || !list.length){ alert("该章节暂无题目"); return; }
  store.quizList = list.sort(()=>Math.random()-0.5);
  store.quizIdx=0; store.quizScore=0; store.answered=false;
  renderQuiz();
}
function renderQuiz(){
  const q = store.quizList[store.quizIdx];
  const total = store.quizList.length;
  const ch = CHAPTERS.find(c=>c.id===q.cid);
  $("#page-practice").innerHTML = `<div class="content">
    <div class="topbar"><div class="title">智能练习</div><div class="subtitle">${ch?STAGES[ch.s]+' · '+ch.t:'综合练习'} · 第${store.quizIdx+1}/${total}题</div></div>
    <div class="card">
      <div style="font-size:15px;font-weight:600;margin-bottom:12px">${q.q}</div>
      <div id="opts">${q.opts.map((o,i)=>`<div class="opt" data-i="${i}"><span class="l">${["A","B","C","D"][i]}</span><span>${o}</span></div>`).join("")}</div>
      <div id="qfoot"></div>
    </div>
    <div class="card"><div class="card-head"><div class="h">进度</div><div class="more">已答对 ${store.quizScore}</div></div>
      <div class="bar"><i style="width:${Math.round(store.quizIdx/total*100)}%"></i></div></div>
    <button class="btn btn-primary" id="nextBtn" disabled>${store.quizIdx===total-1?'查看结果':'下一题'}</button>
    <button class="btn btn-ghost" data-act="back" style="margin-top:8px">退出练习</button>
  </div>`;
  $$("#opts .opt").forEach(el=>el.onclick=()=>selectOpt(el));
  go("practice");
}
function selectOpt(el){
  if(store.answered) return;
  const i=+el.dataset.i, q=store.quizList[store.quizIdx];
  store.answered=true;
  if(i===q.ans){ store.quizScore++; record(q,true); } else { record(q,false); }
  $$("#opts .opt").forEach(op=>{ const oi=+op.dataset.i;
    if(oi===q.ans) op.classList.add("right"); else if(oi===i) op.classList.add("wrong"); });
  $("#qfoot").innerHTML = `<div class="ex ${i===q.ans?'ok':'no'}"><b>${i===q.ans?'✓ 回答正确':'✗ 答错了，正确答案 '+["A","B","C","D"][q.ans]}</b><div style="margin-top:6px">${q.exp}</div></div>`;
  $("#nextBtn").disabled=false;
  $("#nextBtn").onclick=()=>{
    if(store.quizIdx===store.quizList.length-1){
      const rate=Math.round(store.quizScore/store.quizList.length*100);
      refreshAbility();
      alert(`练习完成！\n答对 ${store.quizScore}/${store.quizList.length} 题，正确率 ${rate}%`);
      back();
    } else { store.quizIdx++; store.answered=false; renderQuiz(); }
  };
}
function record(q, correct){
  store.records.push({ qid:q.id, mod:q.mod, tag:q.tag, cid:q.cid, correct });
  if(!correct && !store.errors.find(e=>e.qid===q.id)) store.errors.push(q);
}

// ===== AI 答疑页 =====
const AI_QUICK = ["牛顿第二定律怎么用","摩擦力和什么有关","凸透镜成像规律","欧姆定律","平抛运动怎么分解","机械能守恒条件"];
function renderAI(){
  const msgs = store.chatMsgs;
  const listHtml = msgs.length ? msgs.map(m=>
    m.role==="user"
      ? `<div class="msg user"><div class="bubble">${esc(m.text)}</div></div>`
      : `<div class="msg bot"><div class="ava">白</div><div class="bubble"><div class="ai-title">${m.title?('【'+m.title+'】'):''}</div><div class="ai-body">${esc(m.body).replace(/\n/g,'<br>')}</div>${m.formula?`<div class="ai-formula">${esc(m.formula)}</div>`:''}${m.tip?`<div class="ai-tip">💡 ${esc(m.tip)}</div>`:''}</div></div>`
  ).join("") : `<div class="msg bot"><div class="ava">白</div><div class="bubble">你好，我是「小白」AI 助教 🎓<br>问我任何物理知识点，比如公式怎么用、概念怎么理解、容易错在哪～</div></div>`;
  $("#page-ai").innerHTML = `<div class="content ai-page">
    <div class="topbar"><div class="title">AI 答疑</div><div class="subtitle">离线知识库 · 秒回物理问题 · v1.1 小白版</div></div>
    <div class="ai-chat" id="aiChat">${listHtml}</div>
    <div class="ai-quick">${AI_QUICK.map(q=>`<span class="chip" data-q="${q}">${q}</span>`).join("")}</div>
    <div class="ai-input">
      <input id="aiInput" placeholder="输入物理问题，如：牛顿第二定律怎么用">
      <button id="aiSend">发送</button>
    </div>
  </div>`;
  scrollAI();
  $("#aiSend").onclick = sendAI;
  $("#aiInput").onkeydown = e => { if(e.key==="Enter") sendAI(); };
  $$(".ai-quick .chip").forEach(c => c.onclick = () => { $("#aiInput").value = c.dataset.q; sendAI(); });
  go("ai");
}
function sendAI(){
  const inp = $("#aiInput");
  const text = (inp.value||"").trim();
  if(!text) return;
  store.chatMsgs.push({ role:"user", text });
  const ans = aiAnswer(text);
  store.chatMsgs.push({ role:"bot", title:ans.title, body:ans.body, formula:ans.formula, tip:ans.tip });
  inp.value="";
  renderAI();
}
function scrollAI(){ const c=$("#aiChat"); if(c) setTimeout(()=>{ c.scrollTop=c.scrollHeight; },30); }
function esc(s){ return String(s).replace(/[&<>]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c])); }

// ===== 个人中心 =====
function renderProfile(){
  refreshAbility();
  const wrongTags = weakTags(6);
  $("#page-profile").innerHTML = `<div class="content">
    <div class="topbar"><div class="title">我的</div></div>
    <div class="card" style="text-align:center;padding:24px"><div style="font-size:40px">🎓</div><div style="font-size:16px;font-weight:700;margin-top:8px">物理学习助手</div><div style="font-size:13px;color:#999;margin-top:4px">连续学习 ${store.streak} 天</div></div>
    <div class="card"><div class="card-head"><div class="h">学习数据</div></div>
      <div style="display:flex;gap:12px">
        <div style="flex:1;text-align:center"><div style="font-size:24px;font-weight:700;color:#2E86DE">${store.totalDone}</div><div style="font-size:12px;color:#999">累计答题</div></div>
        <div style="flex:1;text-align:center"><div style="font-size:24px;font-weight:700;color:#2E86DE">${store.correctRate}%</div><div style="font-size:12px;color:#999">正确率</div></div>
        <div style="flex:1;text-align:center"><div style="font-size:24px;font-weight:700;color:#2E86DE">${store.errors.length}</div><div style="font-size:12px;color:#999">错题</div></div>
      </div></div>
    <div class="card"><div class="card-head"><div class="h">易错知识点</div></div>
      ${wrongTags.length ? wrongTags.map(w=>`<div class="chapter"><div class="mid"><div class="t" style="font-size:13px">${w.tag}</div><div class="b"><span>${w.mod}</span><span>错 ${w.wrong}/${w.total} 次</span></div></div></div>`).join("") : '<div class="empty"><div class="e">✅</div><div>还没有错题，继续保持！</div></div>'}
    </div>
    <button class="btn btn-ghost" data-act="home" style="margin-top:8px">返回首页</button>
  </div>`;
  go("profile");
}

// ===== 能力统计 =====
function weakTags(limit){
  const map={};
  store.records.forEach(r=>{ if(r.correct) return; if(!map[r.tag]) map[r.tag]={tag:r.tag,mod:r.mod,total:0,wrong:0}; map[r.tag].total++; map[r.tag].wrong++; });
  return Object.values(map).sort((a,b)=>b.wrong-a.wrong).slice(0,limit||6);
}
function refreshAbility(){
  const r=store.records; if(!r.length) return;
  store.totalDone=r.length;
  store.correctRate=Math.round(r.filter(x=>x.correct).length/r.length*100);
}

// ===== 事件委托 =====
document.addEventListener("click", e=>{
  const act = e.target.closest("[data-act]");
  if(act){ const [name,param]=act.dataset.act.split(":");
    if(name==="back") back(); else if(name==="doq") startQuiz(param); else navigate(name,param); return; }
  const seg = e.target.closest(".seg button");
  if(seg && seg.dataset.s){ if(seg.dataset.s===store.stage) return; store.stage=seg.dataset.s; renderKnowledge(); }
});

// ===== 底部 Tab =====
function initTabs(){
  $("#tabbar").innerHTML = [["home","🏠","首页"],["knowledge","📖","知识"],["practice","📝","练习"],["ai","🤖","AI"],["profile","👤","我的"]]
    .map(([n,i,t])=>`<div class="tab ${n==='home'?'on':''}" data-tab="${n}"><i>${i}</i><div class="t">${t}</div></div>`).join("");
  $$(".tab").forEach(t=>t.onclick=()=>{ historyStack=[]; routes[t.dataset.tab](); go(t.dataset.tab); });
}

// ===== 初始化 =====
initTabs(); renderHome(); go("home");
