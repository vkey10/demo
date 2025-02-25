using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;

namespace OpticsSimulatorWPF
{
    public class OpticsSimulator
    {
        private Canvas canvas;
        private DrawingContext ctx;
        public string currentType;
        public double focalLength;
        public double objectDistance;
        public double objectHeight;
        public double width;
        public double height;
        public double centerY;
        public double opticalCenter;

        public OpticsSimulator(Canvas canvas)
        {
            this.canvas = canvas;
            this.ctx = null; // DrawingContext is obtained during rendering
            this.currentType = "convex-lens";
            this.focalLength = 100;
            this.objectDistance = 150;
            this.objectHeight = 50;

            this.setupCanvas();
        }

        public void setupCanvas()
        {
            // Set canvas dimensions
            this.width = this.canvas.Width;
            this.height = this.canvas.Height;
            this.centerY = this.height / 2;
            this.opticalCenter = this.width / 2;
        }

        public void clear()
        {
            this.canvas.Children.Clear();
        }

        public void drawAxis()
        {
            var drawingVisual = new DrawingVisual();
            using (DrawingContext dc = drawingVisual.RenderOpen())
            {
                dc.DrawLine(new Pen(Brushes.Black, 1) { DashStyle = DashStyles.Dash }, new Point(0, this.centerY), new Point(this.width, this.centerY));
                dc.DrawLine(new Pen(Brushes.Black, 1) { DashStyle = DashStyles.Dash }, new Point(this.opticalCenter, 0), new Point(this.opticalCenter, this.height));
            }
            this.canvas.Children.Add(new DrawingVisualHost(drawingVisual));
        }

        public void drawLens()
        {
            var drawingVisual = new DrawingVisual();
            using (DrawingContext dc = drawingVisual.RenderOpen())
            {
                Pen pen = new Pen(Brushes.DodgerBlue, 2);

                if (this.currentType == "convex-lens")
                {
                    // Draw convex lens
                    dc.DrawLine(pen, new Point(this.opticalCenter - 10, this.centerY - 80), new Point(this.opticalCenter + 20, this.centerY));
                    dc.DrawLine(pen, new Point(this.opticalCenter + 10, this.centerY - 80), new Point(this.opticalCenter - 20, this.centerY));
                }
                else
                {
                    // Draw concave lens
                    dc.DrawLine(pen, new Point(this.opticalCenter - 10, this.centerY - 80), new Point(this.opticalCenter - 30, this.centerY));
                    dc.DrawLine(pen, new Point(this.opticalCenter + 10, this.centerY - 80), new Point(this.opticalCenter + 30, this.centerY));
                }
            }
            this.canvas.Children.Add(new DrawingVisualHost(drawingVisual));
        }

        public void drawMirror()
        {
            var drawingVisual = new DrawingVisual();
            using (DrawingContext dc = drawingVisual.RenderOpen())
            {
                Pen pen = new Pen(Brushes.DodgerBlue, 2);

                if (this.currentType == "concave-mirror")
                {
                    // Draw concave mirror
                    dc.DrawArc(pen, new Point(this.opticalCenter + 100, this.centerY), 100, 0, Math.PI - 0.5, Math.PI + 0.5, true);
                }
                else
                {
                    // Draw convex mirror
                    dc.DrawArc(pen, new Point(this.opticalCenter - 100, this.centerY), 100, 0, -0.5, 0.5, true);
                }
            }
            this.canvas.Children.Add(new DrawingVisualHost(drawingVisual));
        }

        public void drawObject()
        {
            double objectX = this.opticalCenter - this.objectDistance;

            var drawingVisual = new DrawingVisual();
            using (DrawingContext dc = drawingVisual.RenderOpen())
            {
                Pen pen = new Pen(Brushes.Emerald, 2);

                // Draw object arrow
                dc.DrawLine(pen, new Point(objectX, this.centerY), new Point(objectX, this.centerY - this.objectHeight));
                dc.DrawLine(pen, new Point(objectX, this.centerY - this.objectHeight), new Point(objectX - 5, this.centerY - this.objectHeight + 10));
                dc.DrawLine(pen, new Point(objectX, this.centerY - this.objectHeight), new Point(objectX + 5, this.centerY - this.objectHeight + 10));
            }
            this.canvas.Children.Add(new DrawingVisualHost(drawingVisual));
        }

        public (double distance, double height) calculateImage()
        {
            // Simple thin lens equation: 1/f = 1/u + 1/v
            double f = this.focalLength;
            double u = this.objectDistance;

            // Calculate image distance
            double v = (u * f) / (u - f);

            // Calculate magnification
            double m = -v / u;

            // Calculate image height
            double imageHeight = this.objectHeight * m;

            return (v, imageHeight);
        }

        public void drawImage()
        {
            var image = this.calculateImage();
            double imageX = this.opticalCenter + image.distance;

            var drawingVisual = new DrawingVisual();
            using (DrawingContext dc = drawingVisual.RenderOpen())
            {
                Pen pen = new Pen(Brushes.Tomato, 2) { DashStyle = DashStyles.Dash };

                // Draw image arrow
                dc.DrawLine(pen, new Point(imageX, this.centerY), new Point(imageX, this.centerY - image.height));
                dc.DrawLine(pen, new Point(imageX, this.centerY - image.height), new Point(imageX - 5, this.centerY - image.height + 10));
                dc.DrawLine(pen, new Point(imageX, this.centerY - image.height), new Point(imageX + 5, this.centerY - image.height + 10));
            }
            this.canvas.Children.Add(new DrawingVisualHost(drawingVisual));
        }

        public void render()
        {
            this.clear();
            this.drawAxis();

            if (this.currentType.Contains("lens"))
            {
                this.drawLens();
            }
            else
            {
                this.drawMirror();
            }

            this.drawObject();
            this.drawImage();
        }

        public void updateType(string type)
        {
            this.currentType = type;
            this.render();
        }

        public void updateParameters(double focalLength, double objectDistance, double objectHeight)
        {
            this.focalLength = focalLength;
            this.objectDistance = objectDistance;
            this.objectHeight = objectHeight;
            this.render();
        }
    }

    public class RayTracer
    {
        private OpticsSimulator simulator;
        private DrawingContext ctx;

        public RayTracer(OpticsSimulator simulator)
        {
            this.simulator = simulator;
            this.ctx = null; // DrawingContext is obtained during rendering
        }

        public void drawRay(double startX, double startY, double endX, double endY, Brush color = Brushes.OrangeRed)
        {
            var drawingVisual = new DrawingVisual();
            using (DrawingContext dc = drawingVisual.RenderOpen())
            {
                dc.DrawLine(new Pen(color, 1), new Point(startX, startY), new Point(endX, endY));
            }
            this.simulator.canvas.Children.Add(new DrawingVisualHost(drawingVisual));
        }

        public void traceParallelRay()
        {
            double objectX = this.simulator.opticalCenter - this.simulator.objectDistance;
            double objectY = this.simulator.centerY - this.simulator.objectHeight;

            // Ray parallel to principal axis
            this.drawRay(
                objectX,
                objectY,
                this.simulator.opticalCenter,
                objectY
            );

            // Ray through focal point
            var image = this.simulator.calculateImage();
            double imageX = this.simulator.opticalCenter + image.distance;
            double imageY = this.simulator.centerY - image.height;

            this.drawRay(
                this.simulator.opticalCenter,
                objectY,
                imageX,
                imageY
            );
        }

        public void traceFocalRay()
        {
            double objectX = this.simulator.opticalCenter - this.simulator.objectDistance;
            double objectY = this.simulator.centerY - this.simulator.objectHeight;
            double focalX = this.simulator.opticalCenter + this.simulator.focalLength;

            // Ray through focal point
            this.drawRay(
                objectX,
                objectY,
                this.simulator.opticalCenter,
                this.simulator.centerY + (this.simulator.focalLength * Math.Tan(Math.Atan2(objectY - this.simulator.centerY, objectX - this.simulator.opticalCenter)))
            );

            // Refracted ray
            var image = this.simulator.calculateImage();
            double imageX = this.simulator.opticalCenter + image.distance;
            double imageY = this.simulator.centerY - image.height;

            this.drawRay(
                this.simulator.opticalCenter,
                this.simulator.centerY + (this.simulator.focalLength * Math.Tan(Math.Atan2(objectY - this.simulator.centerY, objectX - this.simulator.opticalCenter))),
                imageX,
                imageY
            );
        }

        public void trace()
        {
            this.traceParallelRay();
            this.traceFocalRay();
        }
    }

    public class DrawingVisualHost : FrameworkElement
    {
        private VisualCollection _children;

        public DrawingVisualHost()
        {
            _children = new VisualCollection(this);
            _children.Add(CreateDrawingVisual());
        }

        private DrawingVisual CreateDrawingVisual()
        {
            DrawingVisual drawingVisual = new DrawingVisual();
            using (DrawingContext dc = drawingVisual.RenderOpen())
            {
                // Drawing instructions here
            }
            return drawingVisual;
        }

        protected override int VisualChildrenCount => _children.Count;

        protected override Visual GetVisualChild(int index)
        {
            if (index < 0 || index >= _children.Count)
            {
                throw new ArgumentOutOfRangeException();
            }

            return _children[index];
        }
    }
}


