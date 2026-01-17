'use client';

import { useEffect, useState } from 'react';
import { GachaSystem, GachaResult } from '@/lib/gacha/engine';

export default function GachaTestPage() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    runTests();
  }, []);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, message]);
    console.log(message);
  };

  const runTests = () => {
    addLog('=== 开始抽卡引擎测试 ===\n');

    test6StarPity();
    test5StarPity();
    test100Rolls();
    testTenPulls();

    addLog('\n=== 测试完成 ===');
  };

  const test6StarPity = () => {
    addLog('【测试1: 6星保底逻辑】');
    const system = new GachaSystem();
    let sixStarCount = 0;
    let maxPity6 = 0;

    for (let i = 1; i <= 80; i++) {
      const result = system.rollSingle();
      if (result.character.rarity === 6) {
        sixStarCount++;
        maxPity6 = Math.max(maxPity6, i);
        addLog(`  第 ${i} 抽: 获得 6★ ${result.character.name}`);
        break;
      }
    }

    if (sixStarCount === 1 && maxPity6 === 80) {
      addLog('  ✅ 6星保底测试通过: 第80抽必定获得6星\n');
    } else {
      addLog(`  ❌ 6星保底测试失败: 6星数量=${sixStarCount}, 最大保底=${maxPity6}\n`);
    }
  };

  const test5StarPity = () => {
    addLog('【测试2: 5星保底逻辑】');
    const system = new GachaSystem();
    let fiveStarCount = 0;
    let maxPity5 = 0;

    for (let i = 1; i <= 10; i++) {
      const result = system.rollSingle();
      if (result.character.rarity === 5) {
        fiveStarCount++;
        maxPity5 = Math.max(maxPity5, i);
        addLog(`  第 ${i} 抽: 获得 5★ ${result.character.name}`);
        break;
      }
    }

    if (fiveStarCount === 1 && maxPity5 === 10) {
      addLog('  ✅ 5星保底测试通过: 第10抽必定获得5星\n');
    } else {
      addLog(`  ❌ 5星保底测试失败: 5星数量=${fiveStarCount}, 最大保底=${maxPity5}\n`);
    }
  };

  const test100Rolls = () => {
    addLog('【测试3: 100次抽卡统计】');
    const system = new GachaSystem();
    const stats = { 4: 0, 5: 0, 6: 0 };

    for (let i = 1; i <= 100; i++) {
      const result = system.rollSingle();
      stats[result.character.rarity]++;
    }

    addLog(`  4★: ${stats[4]} 次 (${(stats[4] / 100 * 100).toFixed(1)}%)`);
    addLog(`  5★: ${stats[5]} 次 (${(stats[5] / 100 * 100).toFixed(1)}%)`);
    addLog(`  6★: ${stats[6]} 次 (${(stats[6] / 100 * 100).toFixed(1)}%)`);

    const expected6 = 100 * 0.008;
    const expected5 = 100 * 0.08;

    if (stats[6] >= 0 && stats[6] <= 5) {
      addLog('  ✅ 6星概率在合理范围内\n');
    } else {
      addLog(`  ⚠️ 6星概率可能异常: 预期约${expected6.toFixed(1)}次, 实际${stats[6]}次\n`);
    }

    if (stats[5] >= 5 && stats[5] <= 15) {
      addLog('  ✅ 5星概率在合理范围内\n');
    } else {
      addLog(`  ⚠️ 5星概率可能异常: 预期约${expected5.toFixed(1)}次, 实际${stats[5]}次\n`);
    }
  };

  const testTenPulls = () => {
    addLog('【测试4: 十连抽测试】');
    const system = new GachaSystem();
    const results = system.rollTen();

    const rarities = results.map((r) => r.character.rarity);
    addLog(`  结果: ${rarities.join(', ')}`);

    const has5Or6 = rarities.some((r) => r >= 5);
    if (has5Or6) {
      addLog('  ✅ 十连抽包含5星或以上\n');
    } else {
      addLog('  ℹ️  十连抽未包含5星或以上（符合概率）\n');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">抽卡引擎测试</h1>
      <div className="bg-zinc-800 rounded-lg p-6 font-mono text-sm max-w-4xl">
        {logs.map((log, index) => (
          <div key={index} className="mb-1">
            {log}
          </div>
        ))}
      </div>
      <p className="mt-4 text-zinc-400 text-sm">
        查看浏览器控制台 (F12) 获取详细日志
      </p>
    </div>
  );
}
