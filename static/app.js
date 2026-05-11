// ============================================================
// 2026大连中考模拟系统 - 逻辑层
// ============================================================

// ===== Tab 切换 =====
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
  document.getElementById(tabId).classList.add('active');
  if (tabId === 'tab-trend') renderTrendChart();
  if (tabId === 'tab-heat') renderHeatAnalysis();
  if (tabId === 'tab-data') renderDataReference();
}

// ===== 初始化下拉菜单 =====
function initSelects() {
  const schoolNames = Object.keys(SCHOOL_DATA);
  document.querySelectorAll('.school-select').forEach(sel => {
    sel.innerHTML = '<option value="">— 请选择 —</option>';
    schoolNames.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      const d = SCHOOL_DATA[name];
      opt.textContent = `${name}（统招${d.tongzhao} / 指标${d.zhibiao_num}个）`;
      sel.appendChild(opt);
    });
  });
  const generalNames = Object.keys(GENERAL_SCHOOLS);
  document.querySelectorAll('.general-select').forEach(sel => {
    sel.innerHTML = '<option value="">— 请选择 —</option>';
    generalNames.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      sel.appendChild(opt);
    });
  });
}

// ===== 收集志愿 =====
function collectVolunteers() {
  return {
    s1: document.getElementById('s1_school').value,
    tongzhao: [
      document.getElementById('s2_tz_a').value,
      document.getElementById('s2_tz_b').value,
      document.getElementById('s2_tz_c').value
    ],
    zhibiao: [
      document.getElementById('s2_zb_a').value,
      document.getElementById('s2_zb_b').value
    ],
    tongtiao: [
      document.getElementById('s2_tt_a').value,
      document.getElementById('s2_tt_b').value
    ],
    s3: document.getElementById('s3_school').value,
    general: [
      document.getElementById('s4_a').value,
      document.getElementById('s4_b').value,
      document.getElementById('s4_c').value,
      document.getElementById('s4_d').value,
      document.getElementById('s4_e').value,
      document.getElementById('s4_f').value
    ]
  };
}

function submitVolunteers() {
  const vol = collectVolunteers();
  const hasAny = vol.tongzhao.some(v=>v) || vol.zhibiao.some(v=>v) ||
                 vol.tongtiao.some(v=>v) || vol.general.some(v=>v) || vol.s1 || vol.s3;
  if (!hasAny) { alert('请至少填报一个志愿！'); return; }
  document.getElementById('scoreModal').classList.add('active');
  document.getElementById('scoreInput').focus();
}

function closeModal() { document.getElementById('scoreModal').classList.remove('active'); }
function resetForm() {
  document.querySelectorAll('#tab-form select').forEach(s => s.selectedIndex = 0);
  document.getElementById('resultPanel').classList.remove('active');
  document.getElementById('resultPanel').innerHTML = '';
}

// ===== 模拟录取核心逻辑 =====
function simulateAdmission() {
  const scoreStr = document.getElementById('scoreInput').value;
  if (!scoreStr) { alert('请输入中考成绩！'); return; }
  const score = parseFloat(scoreStr);
  if (score < 400 || score > 800) { alert('请输入有效的分数（400-800）'); return; }
  const vol = collectVolunteers();
  closeModal();

  const steps = [];
  let admitted = null, admittedType = '';

  // 第一段提前录取
  if (vol.s1) {
    steps.push({ phase:'第一段·提前录取', school:vol.s1, type:'提前录取', result:'skip', detail:'美术专业需专业考试成绩，本模拟跳过此段' });
  }

  // 第二段统招
  const tzLabels = ['统招志愿A','统招志愿B','统招志愿C'];
  for (let i = 0; i < vol.tongzhao.length; i++) {
    const school = vol.tongzhao[i];
    if (!school) { steps.push({ phase:'第二段·统招', school:'（未填报）', type:tzLabels[i], result:'skip', detail:'未填报，跳过' }); continue; }
    if (admitted) { steps.push({ phase:'第二段·统招', school, type:tzLabels[i], result:'skip', detail:'已被前序志愿录取，不再检索' }); continue; }
    const data = SCHOOL_DATA[school];
    if (score >= data.tongzhao) {
      admitted = school; admittedType = '统招';
      steps.push({ phase:'第二段·统招', school, type:tzLabels[i], result:'hit', detail:`你的成绩 ${score} ≥ 统招线 ${data.tongzhao}，✅ 录取！` });
    } else {
      steps.push({ phase:'第二段·统招', school, type:tzLabels[i], result:'fail', detail:`你的成绩 ${score} < 统招线 ${data.tongzhao}，差 ${(data.tongzhao - score).toFixed(1)} 分` });
    }
  }

  // 第二段指标到校
  const zbLabels = ['指标到校志愿A','指标到校志愿B'];
  for (let i = 0; i < vol.zhibiao.length; i++) {
    const school = vol.zhibiao[i];
    if (!school) { steps.push({ phase:'第二段·指标到校', school:'（未填报）', type:zbLabels[i], result:'skip', detail:'未填报，跳过' }); continue; }
    if (admitted) { steps.push({ phase:'第二段·指标到校', school, type:zbLabels[i], result:'skip', detail:'已被前序志愿录取，不再检索' }); continue; }
    const data = SCHOOL_DATA[school];
    if (score >= data.zhibiao_min) {
      admitted = school; admittedType = '指标到校';
      steps.push({ phase:'第二段·指标到校', school, type:zbLabels[i], result:'hit', detail:`你的成绩 ${score} ≥ 9中指标最低分 ${data.zhibiao_min}（统招线${data.tongzhao}，降了${(data.tongzhao - data.zhibiao_min).toFixed(1)}分），✅ 录取！` });
    } else {
      steps.push({ phase:'第二段·指标到校', school, type:zbLabels[i], result:'fail', detail:`你的成绩 ${score} < 9中指标最低分 ${data.zhibiao_min}，差 ${(data.zhibiao_min - score).toFixed(1)} 分` });
    }
  }

  // 第二段指标统调
  const ttLabels = ['指标统调志愿A','指标统调志愿B'];
  for (let i = 0; i < vol.tongtiao.length; i++) {
    const school = vol.tongtiao[i];
    if (!school) { steps.push({ phase:'第二段·指标统调', school:'（未填报）', type:ttLabels[i], result:'skip', detail:'未填报，跳过' }); continue; }
    if (admitted) { steps.push({ phase:'第二段·指标统调', school, type:ttLabels[i], result:'skip', detail:'已被前序志愿录取，不再检索' }); continue; }
    const data = SCHOOL_DATA[school];
    if (score >= data.tongtiao) {
      admitted = school; admittedType = '指标统调';
      steps.push({ phase:'第二段·指标统调', school, type:ttLabels[i], result:'hit', detail:`你的成绩 ${score} ≥ 指标统调线 ${data.tongtiao}，✅ 录取！` });
    } else {
      steps.push({ phase:'第二段·指标统调', school, type:ttLabels[i], result:'fail', detail:`你的成绩 ${score} < 指标统调线 ${data.tongtiao}，差 ${(data.tongtiao - score).toFixed(1)} 分` });
    }
  }

  // 第三段国际班
  if (vol.s3) {
    steps.push({ phase:'第三段·国际班', school:vol.s3, type:'国际班志愿', result:'skip', detail: admitted ? '已被前序志愿录取，不再检索' : '国际班需单独考核，本模拟跳过' });
  }

  // 第四段一般高中
  const gLabels = ['一般高中A','一般高中B','一般高中C','一般高中D','一般高中E','一般高中F'];
  for (let i = 0; i < vol.general.length; i++) {
    const school = vol.general[i];
    if (!school) continue;
    if (admitted) { steps.push({ phase:'第四段·一般高中', school, type:gLabels[i], result:'skip', detail:'已被前序志愿录取，不再检索' }); continue; }
    const data = GENERAL_SCHOOLS[school];
    if (score >= data.score) {
      admitted = school; admittedType = '一般普通高中';
      steps.push({ phase:'第四段·一般高中', school, type:gLabels[i], result:'hit', detail:`你的成绩 ${score} ≥ 录取线 ${data.score}，✅ 录取！` });
    } else {
      steps.push({ phase:'第四段·一般高中', school, type:gLabels[i], result:'fail', detail:`你的成绩 ${score} < 录取线 ${data.score}，差 ${(data.score - score).toFixed(1)} 分` });
    }
  }

  renderResult(score, vol, steps, admitted, admittedType);
}

// ===== 渲染结果 =====
function renderResult(score, vol, steps, admitted, admittedType) {
  const panel = document.getElementById('resultPanel');
  // 计算位次
  const mokaScore = zhongkaoToMoka(score);
  const rank = getRankByZkScore(score);
  let html = '';

  // 头部
  if (admitted) {
    html += `<div class="result-header admitted">🎉 模拟录取成功 — 以 <strong>${score}</strong> 分`;
    if (rank) html += `（全市约第 ${rank} 名）`;
    html += `通过【${admittedType}】被 <strong>${admitted}</strong> 录取</div>`;
  } else {
    html += `<div class="result-header rejected">😔 ${score} 分`;
    if (rank) html += `（全市约第 ${rank} 名）`;
    html += `未被任何填报的学校录取</div>`;
  }

  html += '<div class="result-body">';

  // 位次信息
  if (rank) {
    html += `<div class="analysis-box" style="margin-top:0;margin-bottom:16px;">
      <h3>📍 你的位次信息</h3>
      <p>中考总分 <strong>${score}</strong>（模考分 ${mokaScore}/600 + 已确定科目 190）→ 全市约第 <strong>${rank}</strong> 名</p>
      <p style="margin-top:6px;">各校2025统招估算截止排名（位次法）：`;
    const topSchools = ['24中','育明','8中','辽附','1中','23中'];
    topSchools.forEach(s => {
      const cr = CUTOFF_RANKS_2025[s];
      if (cr) {
        html += `<span class="rank-badge ${rank <= cr.cutoffRank ? 'rank-low' : 'rank-high'}">${s} ≈第${cr.cutoffRank}名</span> `;
      }
    });
    html += '</p></div>';
  }

  // 录取过程
  html += '<h3 style="font-size:15px;color:#1a3a6c;margin-bottom:12px;">📋 录取检索过程</h3>';
  let currentPhase = '';
  steps.forEach(step => {
    if (step.phase !== currentPhase) {
      currentPhase = step.phase;
      html += `<div style="font-size:12px;font-weight:600;color:#1a3a6c;margin:12px 0 6px;padding:4px 0;border-bottom:1px solid #e0e4ef;">${currentPhase}</div>`;
    }
    const icons = { hit:'✓', pass:'✓', fail:'✗', skip:'—' };
    html += `<div class="result-step ${step.result}">
      <div class="step-icon">${icons[step.result]||'—'}</div>
      <div class="step-content">
        <strong>${step.type}</strong>：<span class="step-school">${step.school}</span><br>
        <span style="font-size:12px;">${step.detail}</span>
      </div></div>`;
  });

  // 策略分析
  html += '<div class="analysis-box"><h3>📊 志愿填报分析</h3><ul>';
  if (admitted) {
    const data = SCHOOL_DATA[admitted] || GENERAL_SCHOOLS[admitted];
    if (admittedType === '统招') {
      html += `<li>你以 <span class="success">${score}</span> 分通过<strong>统招</strong>进入${admitted}（统招线 ${data.tongzhao}）</li>`;
      const zbSchools = vol.zhibiao.filter(s => s && SCHOOL_DATA[s]);
      zbSchools.forEach(s => {
        const sd = SCHOOL_DATA[s];
        if (sd.tongzhao > data.tongzhao && score >= sd.zhibiao_min) {
          html += `<li>💡 <span class="highlight">关键发现</span>：你的指标到校填了${s}（统招线${sd.tongzhao}），但统招先录取了你。如果统招不填${admitted}，你有可能通过指标到校进${s}！</li>`;
        }
      });
    }
    if (admittedType === '指标到校') {
      html += `<li>你以 <span class="success">${score}</span> 分通过<strong>指标到校</strong>进入${admitted}</li>`;
      html += `<li>该校统招线 ${data.tongzhao}，指标到校让你<span class="success">降了 ${(data.tongzhao - data.zhibiao_min).toFixed(1)} 分</span>录取</li>`;
      const fil = ZHIBIAO_FILING_2025[data.short];
      if (fil) html += `<li>2025年该校指标A+B共${fil.filAB}人填报，竞争${fil.quota}个名额（${(fil.filAB/fil.quota).toFixed(1)}倍竞争）</li>`;
    }
    if (admittedType === '指标统调') {
      html += `<li>你以 <span class="success">${score}</span> 分通过<strong>指标统调</strong>进入${admitted}（统调线${data.tongtiao}）</li>`;
    }
    if (admittedType === '一般普通高中') {
      html += `<li>你进入第四段一般普通高中：${admitted}</li>`;
      html += `<li><span class="highlight">建议</span>：争取提升成绩进入第二段省级示范性高中</li>`;
    }
  } else {
    html += `<li><span class="highlight">所有志愿均未达到录取线</span>，请降低目标或充分利用指标到校</li>`;
  }
  html += '</ul></div>';

  // 分数线参考表
  html += '<div class="analysis-box"><h3>📊 2025年9中各校录取分数线（你填报的学校高亮）</h3>';
  html += `<div style="overflow-x:auto;"><table class="data-table">
    <thead><tr><th>学校</th><th>统招线</th><th>指标最低分</th><th>分差</th><th>指标名额</th><th>2026统招变化</th><th>你的${score}分</th></tr></thead><tbody>`;
  Object.entries(SCHOOL_DATA).forEach(([name, d]) => {
    const isTarget = vol.tongzhao.includes(name) || vol.zhibiao.includes(name) || vol.tongtiao.includes(name);
    const cmp = ZHIBIAO_COMPARE[d.short];
    const enr = ENROLLMENT_2026[d.short];
    const diff = cmp ? cmp.diff2025 : 0;
    const tzChange = enr ? enr.tz_change : 0;
    html += `<tr ${isTarget?'class="current"':''}>
      <td style="text-align:left;">${d.short}${isTarget?' ⭐':''}</td>
      <td>${d.tongzhao}</td><td>${d.zhibiao_min}</td>
      <td style="color:${diff<0?'#e74c3c':diff>3?'#27ae60':'#666'}">${diff>0?'+':''}${diff.toFixed(1)}</td>
      <td>${d.zhibiao_num}个</td>
      <td class="${tzChange<0?'change-up':'change-zero'}">${tzChange<0?tzChange:'—'}</td>
      <td>${score>=d.tongzhao?'<span style="color:#27ae60;font-weight:700">统招✓</span>':
           score>=d.zhibiao_min?'<span style="color:#2e7d32;font-weight:700">指标✓</span>':
           score>=d.tongtiao?'<span style="color:#e65100;font-weight:700">统调✓</span>':
           '<span style="color:#ccc">✗</span>'}</td></tr>`;
  });
  html += '</tbody></table></div></div>';
  html += '</div>';

  panel.innerHTML = html;
  panel.classList.add('active');
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===== Tab2: 数据参考 =====
function renderDataReference() {
  const container = document.getElementById('dataRefContent');
  if (container.innerHTML) return; // 已渲染

  let html = '';

  // 一分一段查询
  html += `<div class="chart-container">
    <h3>📍 一分一段位次查询（2026年模考）</h3>
    <div style="font-size:12px;color:#856404;background:#fff3cd;padding:8px 12px;border-radius:6px;margin-bottom:10px;">💡 <strong>位次法</strong>：模考与中考难度不同，分数不可直接比较，但排名具有可比性。以下根据各校统招人数×报考集中度系数估算截止排名。</div>
    <div class="rank-query">
      <label style="font-size:14px;font-weight:600;">输入模考分数（600分制）：</label>
      <input type="number" id="rankQueryInput" placeholder="550" min="300" max="600" step="1">
      <button class="btn btn-primary btn-sm" onclick="queryRank()">查询位次</button>
      <span style="font-size:12px;color:#888;">或输入790分制总分查位次：</span>
      <input type="number" id="rankQueryZk" placeholder="740" min="490" max="790" step="0.5">
      <button class="btn btn-primary btn-sm" onclick="queryRankZk()">查询</button>
    </div>
    <div id="rankQueryResult"></div>
    <div style="margin-top:15px;overflow-x:auto;max-height:400px;overflow-y:auto;">
      <table class="data-table" id="yifenTable">
        <thead><tr><th>模考分</th><th>全市排名</th><th>统招可达最高校（位次法）</th></tr></thead>
        <tbody>`;
  // 每10分显示一行
  YIFENYIDUAN.filter((_, i) => i % 10 === 0).forEach(row => {
    const rank = row.rank;
    const reachable = Object.entries(CUTOFF_RANKS_2025)
      .filter(([, cr]) => rank <= cr.cutoffRank)
      .sort((a, b) => a[1].cutoffRank - b[1].cutoffRank);
    let schools = '';
    reachable.slice(0, 3).forEach(([short]) => {
      schools += `<span class="tag tag-tongzhao">${short}</span> `;
    });
    if (reachable.length > 3) schools += `<span style="color:#888;font-size:11px;">等${reachable.length}校</span>`;
    html += `<tr><td>${row.score}</td><td>${rank}</td><td style="text-align:left;">${schools||'—'}</td></tr>`;
  });
  html += '</tbody></table></div></div>';

  // 招生计划对比
  html += `<div class="chart-container">
    <h3>📊 2024-2026年招生计划变化</h3>
    <div style="overflow-x:auto;">
    <table class="data-table">
      <thead><tr><th>学校</th><th>2026总招</th><th>2026统招</th><th>统招变化</th><th>2026指标</th><th>2025统招线</th></tr></thead>
      <tbody>`;
  Object.entries(ENROLLMENT_2026).forEach(([short, e]) => {
    const cmp = ZHIBIAO_COMPARE[short];
    html += `<tr>
      <td>${short}</td><td>${e.total}</td><td>${e.tongzhao}</td>
      <td class="${e.tz_change<0?'change-up':'change-zero'}" style="font-weight:700;">${e.tz_change}</td>
      <td>${e.zhibiao}</td>
      <td>${cmp?cmp.tz2025:'—'}</td></tr>`;
  });
  html += '</tbody></table></div>';
  html += '<div style="margin-top:10px;font-size:12px;color:#856404;background:#fff3cd;padding:8px 12px;border-radius:6px;">⚠️ 2026年所有学校统招名额均有缩减（-3到-11人），统招竞争将更加激烈。指标到校名额增加，指标的重要性进一步提升。</div>';
  html += '</div>';

  // 指标名额分配
  html += `<div class="chart-container">
    <h3>📋 2025年9中各校指标到校名额</h3>
    <div style="overflow-x:auto;">
    <table class="data-table">
      <thead><tr><th>学校</th><th>指标名额</th><th>统招线</th><th>指标最低分</th><th>分差</th><th>性价比</th></tr></thead>
      <tbody>`;
  Object.entries(ZHIBIAO_ALLOC_9ZHONG).forEach(([short, num]) => {
    const cmp = ZHIBIAO_COMPARE[short];
    const val = getZhibiaoValue(short);
    html += `<tr>
      <td>${short}</td><td>${num}个</td>
      <td>${cmp?cmp.tz2025:'—'}</td><td>${cmp?cmp.zb2025:'—'}</td>
      <td style="color:${cmp&&cmp.diff2025<0?'#e74c3c':'#27ae60'}">${cmp?cmp.diff2025.toFixed(1):'—'}</td>
      <td style="text-align:left;">${val.rating} ${val.desc}</td></tr>`;
  });
  html += '</tbody></table></div></div>';

  container.innerHTML = html;
}

function queryRank() {
  const input = document.getElementById('rankQueryInput');
  const mokaScore = parseFloat(input.value);
  if (!mokaScore || mokaScore < 300 || mokaScore > 600) { alert('请输入300-600之间的模考分数'); return; }
  const rank = getRankByMokaScore(mokaScore);
  let resultHtml = `<div class="rank-result">模考 <strong>${mokaScore}</strong> 分 → 全市约第 <strong>${rank}</strong> 名`;
  resultHtml += '<div style="margin-top:4px;font-size:12px;color:#856404;">💡 位次法：模考排名≈中考排名，不同考试分数不可直接比较，排名更可靠</div>';
  resultHtml += '<div style="margin-top:8px;font-size:13px;">';
  Object.entries(CUTOFF_RANKS_2025).forEach(([short, cr]) => {
    if (rank <= cr.cutoffRank) {
      resultHtml += `<span class="tag tag-tongzhao">${short} 统招✓(≈${cr.cutoffRank}名)</span> `;
    } else {
      const zbCutoff = getZhibiaoCutoffRank(short);
      if (zbCutoff && rank <= zbCutoff) {
        resultHtml += `<span class="tag tag-zhibiao">${short} 指标可冲</span> `;
      }
    }
  });
  resultHtml += '</div></div>';
  document.getElementById('rankQueryResult').innerHTML = resultHtml;
}

function queryRankZk() {
  const input = document.getElementById('rankQueryZk');
  const zkScore = parseFloat(input.value);
  if (!zkScore || zkScore < 490 || zkScore > 790) { alert('请输入490-790之间的中考总分'); return; }
  const moka = zhongkaoToMoka(zkScore);
  const rank = getRankByZkScore(zkScore);
  let resultHtml = `<div class="rank-result">模考折算 <strong>${moka}</strong> 分 → 全市约第 <strong>${rank}</strong> 名`;
  resultHtml += '<div style="margin-top:4px;font-size:12px;color:#856404;">💡 位次法：模考排名≈中考排名，不同考试分数不可直接比较，排名更可靠</div>';
  resultHtml += '<div style="margin-top:8px;font-size:13px;">';
  Object.entries(CUTOFF_RANKS_2025).forEach(([short, cr]) => {
    if (rank <= cr.cutoffRank) {
      resultHtml += `<span class="tag tag-tongzhao">${short} 统招✓(≈${cr.cutoffRank}名)</span> `;
    } else {
      const zbCutoff = getZhibiaoCutoffRank(short);
      if (zbCutoff && rank <= zbCutoff) {
        resultHtml += `<span class="tag tag-zhibiao">${short} 指标可冲</span> `;
      }
    }
  });
  resultHtml += '</div></div>';
  document.getElementById('rankQueryResult').innerHTML = resultHtml;
}

// ===== Tab3: 分数线趋势 =====
function renderTrendChart() {
  const container = document.getElementById('trendContent');
  if (container.innerHTML) return;

  // 只用2024-2025的数据（790分制）
  const years = [2024, 2025];
  const schools = Object.keys(HISTORY_SCORES);
  // 颜色映射
  const colors = ['#e74c3c','#3498db','#2ecc71','#9b59b6','#f39c12','#1abc9c','#e67e22','#2c3e50',
    '#d35400','#27ae60','#8e44ad','#c0392b','#16a085','#7f8c8d','#2980b9','#f1c40f','#e91e63','#795548'];

  let html = `<div class="chart-container">
    <h3>📈 2024-2025年各校统招分数线对比（790分制）</h3>
    <div style="font-size:12px;color:#888;margin-bottom:10px;">点击学校名称可高亮显示</div>`;

  // 用纯CSS/HTML画表格式对比
  html += '<div style="overflow-x:auto;"><table class="data-table">';
  html += '<thead><tr><th>学校</th><th>2024统招线</th><th>2025统招线</th><th>变化</th><th>2026统招名额变化</th><th>趋势</th></tr></thead><tbody>';

  schools.forEach((short, idx) => {
    const h = HISTORY_SCORES[short];
    const s24 = h[2024], s25 = h[2025];
    if (!s24 || !s25 || s24 < 700) return; // 跳过无数据或非790体系的
    const change = s25 - s24;
    const enr = ENROLLMENT_2026[short];
    const tzChange = enr ? enr.tz_change : 0;
    const arrow = change > 0 ? '📈' : change < 0 ? '📉' : '➡️';
    const changeColor = change > 0 ? '#e74c3c' : change < 0 ? '#27ae60' : '#999';

    // 简单柱状图
    const barWidth24 = Math.max(5, (s24 - 720) * 3);
    const barWidth25 = Math.max(5, (s25 - 720) * 3);

    html += `<tr>
      <td style="font-weight:700;">${short}</td>
      <td>${s24}</td>
      <td>${s25}</td>
      <td style="color:${changeColor};font-weight:700;">${change > 0 ? '+' : ''}${change.toFixed(1)}</td>
      <td class="${tzChange<0?'change-up':'change-zero'}" style="font-weight:600;">${tzChange}</td>
      <td style="text-align:left;">
        <div style="display:flex;align-items:center;gap:4px;">
          <div style="background:#3498db;height:12px;width:${barWidth24}px;border-radius:2px;" title="2024: ${s24}"></div>
          <span style="font-size:10px;color:#3498db;">24</span>
        </div>
        <div style="display:flex;align-items:center;gap:4px;margin-top:2px;">
          <div style="background:#e74c3c;height:12px;width:${barWidth25}px;border-radius:2px;" title="2025: ${s25}"></div>
          <span style="font-size:10px;color:#e74c3c;">25</span>
        </div>
      </td></tr>`;
  });
  html += '</tbody></table></div>';

  // 趋势分析
  html += `<div style="margin-top:15px;padding:12px;background:#f8f9fc;border-radius:8px;border:1px solid #e0e4ef;">
    <h4 style="font-size:13px;color:#1a3a6c;margin-bottom:8px;">📊 趋势分析</h4>
    <ul style="font-size:12px;line-height:2;color:#555;padding-left:16px;">
      <li><strong>24中</strong>：统招线持平777.0，2026统招名额减少10人 → 预计分数线<span style="color:#e74c3c;">可能上涨</span></li>
      <li><strong>育明</strong>：统招线微降1.0（773→772），2026统招减11人 → 预计持平或微涨</li>
      <li><strong>8中</strong>：统招线降2.0（769.5→767.5），2026统招减10人 → 预计基本持平</li>
      <li><strong>23中</strong>：统招线降3.0（762→759），降幅较大，2026统招减11人 → 需关注</li>
      <li><strong>整体趋势</strong>：2026年所有学校统招名额均缩减，指标增加，统招竞争加剧</li>
    </ul>
  </div>`;
  html += '</div>';

  container.innerHTML = html;
}

// ===== Tab4: 指标竞争热度 =====
function renderHeatAnalysis() {
  const container = document.getElementById('heatContent');
  if (container.innerHTML) return;

  let html = `<div class="chart-container">
    <h3>🔥 2025年9中指标到校竞争热度分析</h3>
    <p style="font-size:12px;color:#888;margin-bottom:15px;">
      热度 = 填报A+B总人数 ÷ 指标名额数。热度越高，竞争越激烈。
    </p>`;

  // 热力图
  html += '<div style="overflow-x:auto;"><table class="data-table">';
  html += '<thead><tr><th>学校</th><th>指标名额</th><th>A志愿人数</th><th>B志愿人数</th><th>合计</th><th>竞争倍率</th><th>热度</th><th>性价比评级</th></tr></thead><tbody>';

  Object.entries(ZHIBIAO_FILING_2025).forEach(([short, f]) => {
    const ratio = f.quota > 0 ? (f.filAB / f.quota) : 0;
    const heat = getHeatLevel(f.filAB, f.quota);
    const val = getZhibiaoValue(short);
    const barWidth = Math.min(300, ratio * 40);

    html += `<tr>
      <td style="font-weight:700;">${short}</td>
      <td>${f.quota}个</td>
      <td>${f.filA}</td>
      <td>${f.filB}</td>
      <td style="font-weight:700;">${f.filAB}</td>
      <td style="font-weight:700;">${ratio.toFixed(1)}倍</td>
      <td style="text-align:left;min-width:200px;">
        <div class="heat-bar ${heat.color}" style="width:${barWidth}px;">${heat.label}</div>
      </td>
      <td style="text-align:left;font-size:12px;">${val.rating}<br><span style="color:#888;">${val.desc}</span></td>
    </tr>`;
  });
  html += '</tbody></table></div>';

  // 策略建议
  html += `<div style="margin-top:15px;padding:12px;background:#f8f9fc;border-radius:8px;border:1px solid #e0e4ef;">
    <h4 style="font-size:13px;color:#1a3a6c;margin-bottom:8px;">💡 指标到校策略建议（基于9中数据）</h4>
    <ul style="font-size:12px;line-height:2;color:#555;padding-left:16px;">
      <li>🔴 <strong>24中</strong>（8.2倍竞争）：6个名额49人抢指标A，极度惨烈。除非成绩非常接近统招线，否则指标到校意义不大</li>
      <li>🔴 <strong>24金</strong>（9.0倍竞争）：仅1个名额，基本靠运气</li>
      <li>🟡 <strong>育明</strong>（4.4倍竞争）：竞争激烈但有7个名额，有一定机会</li>
      <li>🟡 <strong>8中</strong>（14.6倍竞争）：大量B志愿堆积，指标A填的人相对少，优先填指标A有策略价值</li>
      <li>🟢 <strong>理工附/3中/11中</strong>：竞争倍率低，名额相对充裕，指标到校性价比高</li>
      <li>⚠️ <strong>1中/23中/36中</strong>：指标最低分高于统招线（分差为负），在9中用指标到校反而亏，不如直接统招</li>
    </ul>
  </div>`;

  // 2024-2025指标对比
  html += `<div style="margin-top:20px;"><h3 style="font-size:15px;color:#1a3a6c;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #e8edf5;">📊 2024 vs 2025 指标使用对比</h3>`;
  html += '<div style="overflow-x:auto;"><table class="data-table">';
  html += '<thead><tr><th rowspan="2">学校</th><th colspan="3">2025年</th><th colspan="3">2024年</th><th rowspan="2">趋势</th></tr>';
  html += '<tr><th>统招线</th><th>指标最低分</th><th>分差</th><th>统招线</th><th>指标最低分</th><th>分差</th></tr></thead><tbody>';

  Object.entries(ZHIBIAO_COMPARE).forEach(([short, c]) => {
    const d25color = c.diff2025 < 0 ? '#e74c3c' : c.diff2025 > 5 ? '#27ae60' : '#666';
    const d24color = c.diff2024 !== null ? (c.diff2024 < 0 ? '#e74c3c' : c.diff2024 > 5 ? '#27ae60' : '#666') : '#999';
    let trend = '—';
    if (c.diff2024 !== null) {
      const delta = c.diff2025 - c.diff2024;
      trend = delta > 0 ? `<span style="color:#27ae60;">分差↑${delta.toFixed(1)}</span>` :
              delta < 0 ? `<span style="color:#e74c3c;">分差↓${Math.abs(delta).toFixed(1)}</span>` : '持平';
    }
    html += `<tr>
      <td style="font-weight:700;">${short}</td>
      <td>${c.tz2025}</td><td>${c.zb2025}</td>
      <td style="color:${d25color};font-weight:700;">${c.diff2025.toFixed(1)}</td>
      <td>${c.tz2024}</td><td>${c.zb2024 !== null ? c.zb2024 : '—'}</td>
      <td style="color:${d24color};font-weight:700;">${c.diff2024 !== null ? c.diff2024.toFixed(1) : '—'}</td>
      <td>${trend}</td></tr>`;
  });
  html += '</tbody></table></div></div>';
  html += '</div>';

  container.innerHTML = html;
}

// ===== 事件绑定 =====
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && document.getElementById('scoreModal').classList.contains('active')) {
    simulateAdmission();
  }
});

// ===== 初始化 =====
initSelects();
