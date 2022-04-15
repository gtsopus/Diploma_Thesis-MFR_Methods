## Development of Multifragment Rendering Methods for 3D Graphics
### Diploma Thesis
#### Grigorios Tsopouridis
#### Supervisor: Prof. Ioannis Fudos
#### Dept. of Computer Science and Engineering, University of Ioannina

This repository contains a copy of my diploma thesis as well as some accompanying code and shaders used during this work.
The thesis was completed as a requirement for graduating from the Dept. of Computer Science and Engineering, University of Ioannina 5 year integrated master program.

\
I would also like to thank Dr. Andreas-Alexandros Vasilakis for his support throughout this thesis.


## Aim
The goals of this thesis were:

- Implement, compare and test different MFR algorithms.
- Try to improve the image quality of existing MFR methods by incorporating deep learning techniques.

## Abstract
Modern graphics applications use effects such as transparency or translucency, which are difficult to be rendered correctly. These are just some of the uses of multifragment rendering methods, which require operations on multiple fragments located at the same pixel position to be rendered correctly. Presently, several such methods have been developed that process one to multiple fragments per pixel per rendering pass to produce such multi-fragment effects. Each method differs from the other methods in terms of performance and memory consumption, resulting in different rendering quality and performance, allowing us to choose the most appropriate method for each use case. Several well-known multi-fragment rendering methods (A-Buffer, k-Buffer) and some of their variants are presented, implemented, experimented on, and the results are then briefly presented.

Furthermore, a new method, Deep Learning Variable k-Buffer, is introduced.
Deep Learning Variable k-Buffer attempts to approximate the quality of the memory-intensive A-Buffer, which provides the best visual results, combined with the low memory consumption of Variable k-Buffer by using deep learning to predict an importance value for each pixel.

Finally, a comparison between the results of the proposed method and those of other already established multifragment rendering methods is provided, to evaluate and present their rendering quality and performance.

## Source Code
A shader source code bundle for efficiently solving the visibility determination problem in screen space is provided. This extensive collection includes the implemented multifragment rendering methods the A-Buffer, k-Buffer, Variable k-Buffer, S-Buffer and the neural network model files.


## References:
All appropriate references included in .pdf file.
