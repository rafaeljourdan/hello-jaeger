const mung = require('express-mung');
const opentelemetry = require('@opentelemetry/core');
const { NodeTracer } = require('@opentelemetry/node');
const { initGlobalTracer } = require('@opentelemetry/core');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

const initTracer = (serviceName, host) => {
  const tracer = new NodeTracer({
    plugins: {
      http: {
        enabled: true,
        path: '@opentelemetry/plugin-http'
      }
    }
  });

  const spanExporter = new JaegerExporter({
    serviceName,
    host,
  });

  tracer.addSpanProcessor(new SimpleSpanProcessor(spanExporter));

  initGlobalTracer(tracer);
}

const useMung = () =>
  mung.json((body, req, res) => {
    const tracer = opentelemetry.getTracer();

    const span = tracer.getCurrentSpan();
    if (!span) return;

    const { traceId } = span.context();

    span.addEvent('', { request: JSON.stringify({ body: req.body }, null, 4) });
    span.addEvent('', { response: JSON.stringify({ body }, null, 4) });

    res.append('Jaeger-Trace-Id', traceId);
  });

module.exports = {
  initTracer,
  useMung,
}