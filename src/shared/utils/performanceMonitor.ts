/**
 * パフォーマンス監視ユーティリティ
 * データアクセス層のパフォーマンスを測定し、改善効果を追跡します
 */

interface PerformanceMetric {
  operation: string;
  duration: number;
  timestamp: Date;
  success: boolean;
  error?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private isEnabled: boolean = true;

  /**
   * パフォーマンス監視を有効/無効にする
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * 操作の実行時間を測定する
   */
  async measure<T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    if (!this.isEnabled) {
      return await fn();
    }

    const startTime = performance.now();
    const startTimestamp = new Date();

    try {
      const result = await fn();
      const duration = performance.now() - startTime;

      this.recordMetric({
        operation,
        duration,
        timestamp: startTimestamp,
        success: true,
      });

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;

      this.recordMetric({
        operation,
        duration,
        timestamp: startTimestamp,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  }

  /**
   * メトリクスを記録する
   */
  private recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);

    // メトリクスが1000件を超えたら古いものを削除
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-500);
    }

    // 開発環境ではコンソールに出力
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Performance: ${metric.operation} - ${metric.duration.toFixed(2)}ms`);
    }
  }

  /**
   * 特定の操作の平均実行時間を取得
   */
  getAverageDuration(operation: string): number {
    const operationMetrics = this.metrics.filter(m => m.operation === operation);
    
    if (operationMetrics.length === 0) {
      return 0;
    }

    const totalDuration = operationMetrics.reduce((sum, m) => sum + m.duration, 0);
    return totalDuration / operationMetrics.length;
  }

  /**
   * 特定の操作の成功率を取得
   */
  getSuccessRate(operation: string): number {
    const operationMetrics = this.metrics.filter(m => m.operation === operation);
    
    if (operationMetrics.length === 0) {
      return 0;
    }

    const successCount = operationMetrics.filter(m => m.success).length;
    return (successCount / operationMetrics.length) * 100;
  }

  /**
   * 全メトリクスを取得
   */
  getAllMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * メトリクスをクリア
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * パフォーマンスレポートを生成
   */
  generateReport(): {
    totalOperations: number;
    averageDuration: number;
    successRate: number;
    operations: Array<{
      operation: string;
      count: number;
      averageDuration: number;
      successRate: number;
    }>;
  } {
    if (this.metrics.length === 0) {
      return {
        totalOperations: 0,
        averageDuration: 0,
        successRate: 0,
        operations: [],
      };
    }

    const totalDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    const totalSuccess = this.metrics.filter(m => m.success).length;

    // 操作別の統計を計算
    const operationStats = new Map<string, {
      count: number;
      totalDuration: number;
      successCount: number;
    }>();

    this.metrics.forEach(metric => {
      const stats = operationStats.get(metric.operation) || {
        count: 0,
        totalDuration: 0,
        successCount: 0,
      };

      stats.count++;
      stats.totalDuration += metric.duration;
      if (metric.success) {
        stats.successCount++;
      }

      operationStats.set(metric.operation, stats);
    });

    const operations = Array.from(operationStats.entries()).map(([operation, stats]) => ({
      operation,
      count: stats.count,
      averageDuration: stats.totalDuration / stats.count,
      successRate: (stats.successCount / stats.count) * 100,
    }));

    return {
      totalOperations: this.metrics.length,
      averageDuration: totalDuration / this.metrics.length,
      successRate: (totalSuccess / this.metrics.length) * 100,
      operations: operations.sort((a, b) => b.count - a.count), // 実行回数順にソート
    };
  }

  /**
   * パフォーマンスレポートをコンソールに出力
   */
  logReport(): void {
    const report = this.generateReport();
    
    console.group('📊 Performance Report');
    console.log(`Total Operations: ${report.totalOperations}`);
    console.log(`Average Duration: ${report.averageDuration.toFixed(2)}ms`);
    console.log(`Success Rate: ${report.successRate.toFixed(1)}%`);
    
    if (report.operations.length > 0) {
      console.group('Operations Breakdown:');
      report.operations.forEach(op => {
        console.log(
          `${op.operation}: ${op.count} calls, ` +
          `${op.averageDuration.toFixed(2)}ms avg, ` +
          `${op.successRate.toFixed(1)}% success`
        );
      });
      console.groupEnd();
    }
    
    console.groupEnd();
  }
}

// シングルトンインスタンス
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
