/**
 * パフォーマンス監視ユーティリティ
 * データアクセス層のパフォーマンスを測定し、改善効果を追跡します
 */

interface PerformanceMetric {
  operation: string;
  duration: number;
  timestamp: Date;
  source: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private isEnabled = true;

  /**
   * パフォーマンス測定を実行
   */
  async measure<T>(
    operation: string,
    fn: () => Promise<T>,
    source?: string
  ): Promise<T> {
    if (!this.isEnabled) {
      return await fn();
    }

    const startTime = performance.now();
    const startTimestamp = new Date();

    try {
      const result = await fn();
      const endTime = performance.now();
      const duration = endTime - startTime;

      const metric: PerformanceMetric = {
        operation,
        duration,
        timestamp: startTimestamp,
        source: source || 'unknown'
      };

      this.metrics.push(metric);

      // ログ出力を有効化（デバッグ用）
      console.log(`Performance: ${operation} - ${duration.toFixed(2)}ms`);
      
      // データアクセス操作の場合は詳細ログを出力
      if (operation.includes('DataAccess')) {
        console.log(`DataAccess Operation: ${operation}`);
        console.log(`Source: ${source || 'unknown'}`);
        console.log(`Duration: ${duration.toFixed(2)}ms`);
        console.log(`Timestamp: ${startTimestamp.toISOString()}`);
      }

      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      console.error(`Performance Error: ${operation} - ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }

  /**
   * メトリクスを取得
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * メトリクスをクリア
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * 統計情報を取得
   */
  getStats(): {
    totalOperations: number;
    averageDuration: number;
    slowestOperation: PerformanceMetric | null;
    fastestOperation: PerformanceMetric | null;
  } {
    if (this.metrics.length === 0) {
      return {
        totalOperations: 0,
        averageDuration: 0,
        slowestOperation: null,
        fastestOperation: null
      };
    }

    const durations = this.metrics.map(m => m.duration);
    const averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const slowestOperation = this.metrics.reduce((a, b) => a.duration > b.duration ? a : b);
    const fastestOperation = this.metrics.reduce((a, b) => a.duration < b.duration ? a : b);

    return {
      totalOperations: this.metrics.length,
      averageDuration,
      slowestOperation,
      fastestOperation
    };
  }

  /**
   * 有効/無効を切り替え
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * 統計情報をログ出力
   */
  logStats(): void {
    const stats = this.getStats();
    console.log('=== Performance Statistics ===');
    console.log(`Total Operations: ${stats.totalOperations}`);
    console.log(`Average Duration: ${stats.averageDuration.toFixed(2)}ms`);
    if (stats.slowestOperation) {
      console.log(`Slowest Operation: ${stats.slowestOperation.operation} (${stats.slowestOperation.duration.toFixed(2)}ms)`);
    }
    if (stats.fastestOperation) {
      console.log(`Fastest Operation: ${stats.fastestOperation.operation} (${stats.fastestOperation.duration.toFixed(2)}ms)`);
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();

/**
 * パフォーマンス監視デコレータ
 * クラスメソッドに適用して自動的にパフォーマンスを測定
 */
export function monitorPerformance(operationName?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const operation = operationName || `${target.constructor.name}.${propertyName}`;

    descriptor.value = async function (...args: any[]) {
      return await performanceMonitor.measure(operation, () => method.apply(this, args));
    };
  };
}

/**
 * パフォーマンス監視フック
 * Reactコンポーネントでの使用を想定
 */
export function usePerformanceMonitor() {
  return {
    measure: performanceMonitor.measure.bind(performanceMonitor),
    getReport: performanceMonitor.generateReport.bind(performanceMonitor),
    logReport: performanceMonitor.logReport.bind(performanceMonitor),
    clearMetrics: performanceMonitor.clearMetrics.bind(performanceMonitor),
  };
}
