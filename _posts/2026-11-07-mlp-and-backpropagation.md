---
layout: post
title: 多层感知机与误差反向传播：推导与三个数值算例
date: 2026-11-07
---

本文从链式法则推导多层感知机的参数梯度，再用三个自行设计的算例，逐步检查前向运算、反向传播与一次梯度下降更新。读者只需具备矩阵乘法与微分基础。核心结论是：反向传播以逐层重用中间导数的方式，精确计算损失对各层参数的梯度；学习则由优化器根据梯度更新参数。

## 一 模型定义与符号

设网络有 L 个带参数的层，输入不计入 L。所有向量皆为列向量。第 ℓ 层有 nℓ 个神经元，Wℓ 的尺寸为 nℓ × nℓ₋₁，bℓ、zℓ 与 aℓ 的尺寸均为 nℓ × 1。激活函数通常逐元素作用，Softmax 则整体作用于输出向量。

```
a⁰=x；zℓ=Wℓaℓ⁻¹+bℓ；aℓ=φℓ(zℓ)；ŷ=aᴸ
```

若所有层皆采用恒等激活，连乘后仍只是仿射映射；隐藏层的非线性使网络能表达更丰富的函数。以下先考虑一个样本的损失 E，最后再延伸至小批量平均损失 J。

## 二 从链式法则推导反向传播

定义 δℓ=∂E/∂zℓ。对逐元素输出激活，先将损失对输出的导数乘上激活导数，得到输出层误差信号。符号 ⊙ 表示逐元素相乘。

```
δᴸ=(∂E/∂aᴸ) ⊙ φᴸ′(zᴸ)
```

对隐藏层第 i 个神经元，下一层每个神经元都可能受到它的影响，所以链式法则必须对所有下游路径求和。因 zℓ⁺¹ⱼ=ΣᵢWℓ⁺¹ⱼᵢaℓᵢ+bℓ⁺¹ⱼ，可得：

```
∂E/∂aℓᵢ = Σⱼ δℓ⁺¹ⱼ Wℓ⁺¹ⱼᵢ
δℓᵢ = φℓ′(zℓᵢ) Σⱼ Wℓ⁺¹ⱼᵢ δℓ⁺¹ⱼ
δℓ = ((Wℓ⁺¹)ᵀδℓ⁺¹) ⊙ φℓ′(zℓ)
```

再由 ∂zℓᵢ/∂Wℓᵢⱼ=aℓ⁻¹ⱼ 与 ∂zℓᵢ/∂bℓᵢ=1，直接得到参数梯度。外积结果的尺寸与 Wℓ 相同，这也是实现时的重要检查项。

```
∂E/∂Wℓᵢⱼ=δℓᵢaℓ⁻¹ⱼ
∇WℓE=δℓ(aℓ⁻¹)ᵀ；∇bℓE=δℓ
```

对 m 个样本取平均：J=(1/m)ΣᵣEᵣ，各层梯度亦取平均。若加入 (λ/2)Σℓ‖Wℓ‖²，权重梯度额外汇加 λWℓ，偏置是否参与正则化需另行约定。以下算例均为单样本且没有正则化。

```
Wℓ ← Wℓ−η∇WℓJ；bℓ ← bℓ−η∇bℓJ，η>0
```

一次反向传播中，所有误差信号必须使用同一组更新前的权重。先完成全部梯度计算，再同步更新参数，避免下游权重提前更新而污染上游梯度。

## 三 常见激活函数与输出损失

```
Sigmoid：σ(z)=1/(1+e⁻ᶻ)，σ′(z)=σ(z)(1−σ(z))
ReLU：r(z)=max(0,z)，z>0 时 r′=1，z<0 时 r′=0
```

ReLU 在零点不可微；实现通常选取零作为该点的次梯度。本篇 ReLU 算例刻意避开零点，中心差分的扰动亦不跨越零点。

```
线性回归输出：E=½‖ŷ−y‖²，δᴸ=ŷ−y
Sigmoid 二元交叉熵：E=−y ln p−(1−y)ln(1−p)，δᴸ=p−y
```

二元交叉熵的化简来自 ∂E/∂p=(p−y)/[p(1−p)] 与 ∂p/∂z=p(1−p) 相乘。多类别分类则使用 Softmax 与交叉熵，假设 Σᵢyᵢ=1：

```
pᵢ=eᶻⁱ/Σⱼeᶻʲ；E=−Σᵢyᵢln pᵢ
∂pᵢ/∂zⱼ=pᵢ(𝟙ᵢ₌ⱼ−pⱼ)
∂E/∂zⱼ=−Σᵢyᵢ(𝟙ᵢ₌ⱼ−pⱼ)=pⱼ−yⱼ
```

Softmax 不能直接套用逐元素激活导数，上述推导已包含其完整 Jacobian 的作用。数值计算使用减去最大 logit 的 Softmax；一般实现交叉熵宜直接以 log-sum-exp 计算，以减少上溢与下溢。

## 四 验证方法与判定依据

```
g数值ᵢ=[E(θ+εeᵢ)−E(θ−εeᵢ)]/(2ε)，ε=10⁻⁶
```

每次仅扰动一个参数，其余参数固定；将这一独立于反向公式的中心差分与解析梯度逐项比较。以下列出全部参数，显示六位小数；实际更新与误差比较使用未四舍五入的值。光滑区域的中心差分截断误差为 O(ε²)，ε 过小仍会产生浮点消去误差。另外检查一次更新后的原损失是否下降。

## 五 算例一：Sigmoid 隐藏层与平方误差

结构为 1→1→1。x=2，y=1，隐藏层用 Sigmoid，输出为线性，E=½(ŷ−1)²。参数依次为 w, b, v, c，初值为 [0.5, 0.1, 0.8, -0.2]；学习率 η=0.1。

前向与误差信号：z₁=1.100000，h=0.750260，ŷ=0.400208；δ₂=ŷ−1=-0.599792；δ₁=δ₂vh(1−h)=-0.089906。

由链式法则：∂E/∂v=δ₂h，∂E/∂c=δ₂，∂E/∂w=δ₁x，∂E/∂b=δ₁。

| 参数 | 解析梯度 | 中心差分 | 更新后 |
| --- | --- | --- | --- |
| w | -0.179813 | -0.179813 | 0.517981 |
| b | -0.089906 | -0.089906 | 0.108991 |
| v | -0.450000 | -0.450000 | 0.845000 |
| c | -0.599792 | -0.599792 | -0.140021 |

验证结果：最大绝对梯度误差为 3.886e-11；更新前 E=0.179875171，更新后 E=0.124507510，损失减少 0.055367661。全部参数的梯度均通过 10⁻⁷ 绝对误差门槛。

## 六 算例二：ReLU 隐藏层与平方误差

结构为 1→2→1。x=1，y=1，隐藏层用 ReLU，输出为线性，E=½(ŷ−1)²。参数依次为 w₁, w₂, b₁, b₂, v₁, v₂, c，初值为 [0.5, -1.0, 0.1, -0.2, 0.4, -0.3, 0.2]；学习率 η=0.05。

前向与误差信号：z=(0.600000, -1.200000)，h=(0.600000, 0.000000)，ŷ=0.440000；δ₂=-0.560000。

由链式法则：δ₁ᵢ=δ₂vᵢ𝟙(z₁ᵢ>0)，∂E/∂wᵢ=δ₁ᵢx，∂E/∂bᵢ=δ₁ᵢ，∂E/∂vᵢ=δ₂hᵢ。第二个神经元因 ReLU 关闭而没有梯度。

| 参数 | 解析梯度 | 中心差分 | 更新后 |
| --- | --- | --- | --- |
| w₁ | -0.224000 | -0.224000 | 0.511200 |
| w₂ | 0.000000 | 0.000000 | -1.000000 |
| b₁ | -0.224000 | -0.224000 | 0.111200 |
| b₂ | 0.000000 | 0.000000 | -0.200000 |
| v₁ | -0.336000 | -0.336000 | 0.416800 |
| v₂ | 0.000000 | 0.000000 | -0.300000 |
| c | -0.560000 | -0.560000 | 0.228000 |

验证结果：最大绝对梯度误差为 2.420e-11；更新前 E=0.156800000，更新后 E=0.131371015，损失减少 0.025428985。全部参数的梯度均通过 10⁻⁷ 绝对误差门槛。

## 七 算例三：Sigmoid 隐藏层与 Softmax 分类

结构为 1→1→2。x=1，y=(1,0)，隐藏层用 Sigmoid，输出为 Softmax，E=−ln p₁。参数依次为 w, b, v₁, v₂, c₁, c₂，初值为 [0.5, 0.1, 0.3, -0.2, 0.1, -0.1]；学习率 η=0.1。

前向与误差信号：h=0.645656，logits=(0.293697, -0.229131)，p=(0.627809, 0.372191)；δ₂=(-0.372191, 0.372191)，δ₁=-0.042576。

由链式法则：δ₂=p−y，δ₁=(v₁δ₂₁+v₂δ₂₂)h(1−h)；∂E/∂vᵢ=δ₂ᵢh，∂E/∂cᵢ=δ₂ᵢ。

| 参数 | 解析梯度 | 中心差分 | 更新后 |
| --- | --- | --- | --- |
| w | -0.042576 | -0.042576 | 0.504258 |
| b | -0.042576 | -0.042576 | 0.104258 |
| v₁ | -0.240308 | -0.240308 | 0.324031 |
| v₂ | 0.240308 | 0.240308 | -0.224031 |
| c₁ | -0.372191 | -0.372191 | 0.137219 |
| c₂ | 0.372191 | 0.372191 | -0.137219 |

验证结果：最大绝对梯度误差为 1.146e-10；更新前 E=0.465519546，更新后 E=0.427181363，损失减少 0.038338183。全部参数的梯度均通过 10⁻⁷ 绝对误差门槛。

## 八 验证结果的意义与适用限制

三例分别验证平滑激活的链式乘积、ReLU 的分段梯度，以及 Softmax 交叉熵的耦合导数。中心差分一致是这些具体参数点上的数值证据；一般层数与维度下的正确性，则由第二节的链式法则推导确立。

在损失可微处，E(θ−ηg)=E(θ)−η‖g‖²+O(η²)，因此非零梯度下，足够小的学习率可使损失下降。本篇三例的下降结果不保证任意学习率、任意初始化都会下降，也不构成全局最小值或泛化能力的证明。

深层网络的反向信号含多层权重与激活导数的乘积，可能出现梯度消失或爆炸。Sigmoid 饱和时导数接近零，ReLU 负半轴则完全没有局部梯度。理解这些因素，有助于判断训练停滞，而不把所有停滞都归因于程序错误。

## 九 可复现的计算流程

对每个算例，依所列初值先算 z、a 与 E，再由输出层向前计算 δ，并建立全部参数梯度。接着对每个参数分别加减 10⁻⁶，重跑前向计算以取得中心差分。最后以表内学习率同步更新所有参数，重算同一样本的损失。本篇所有数值皆依此流程以双精度浮点计算。

---

*English*

This note derives the parameter gradients of a multi-layer perceptron from the chain rule and then, with three examples built for the purpose, walks through the forward pass, the backward pass and one gradient-descent update of each. The reader needs only matrix multiplication and the elements of differentiation. The central point is this: backpropagation computes the exact gradient of the loss with respect to every layer's parameters by reusing intermediate derivatives layer by layer, while learning updates those parameters from the gradient according to the optimiser.

## 1 Model and notation

Let the network have L layers that carry parameters, the input not counted in L. All vectors are column vectors. Layer ℓ holds nℓ neurons; Wℓ has size nℓ × nℓ₋₁, and bℓ, zℓ and aℓ are all nℓ × 1. Activation functions normally act elementwise, whereas Softmax acts on the output vector as a whole.

```
a⁰=x;  zℓ=Wℓaℓ⁻¹+bℓ;  aℓ=φℓ(zℓ);  ŷ=aᴸ
```

If every layer used the identity activation, the composition would still be affine; it is the nonlinearity of the hidden layers that lets the network represent a richer class of functions. Below, E is the loss of a single example; the extension to the mini-batch mean J is deferred to the end.

## 2 Backpropagation from the chain rule

Define δℓ=∂E/∂zℓ. For an elementwise output activation, the derivative of the loss with respect to the output is multiplied by the derivative of the activation, which yields the error signal at the output layer. The symbol ⊙ denotes elementwise multiplication.

```
δᴸ=(∂E/∂aᴸ) ⊙ φᴸ′(zᴸ)
```

For the i-th neuron of a hidden layer, every neuron of the next layer may be affected by it, so the chain rule has to sum over all downstream paths. Since zℓ⁺¹ⱼ=ΣᵢWℓ⁺¹ⱼᵢaℓᵢ+bℓ⁺¹ⱼ, we obtain

```
∂E/∂aℓᵢ = Σⱼ δℓ⁺¹ⱼ Wℓ⁺¹ⱼᵢ
δℓᵢ = φℓ′(zℓᵢ) Σⱼ Wℓ⁺¹ⱼᵢ δℓ⁺¹ⱼ
δℓ = ((Wℓ⁺¹)ᵀδℓ⁺¹) ⊙ φℓ′(zℓ)
```

From ∂zℓᵢ/∂Wℓᵢⱼ=aℓ⁻¹ⱼ and ∂zℓᵢ/∂bℓᵢ=1 the parameter gradients follow directly. The outer product has the same shape as Wℓ, which is a useful check when writing the code.

```
∂E/∂Wℓᵢⱼ=δℓᵢaℓ⁻¹ⱼ
∇WℓE=δℓ(aℓ⁻¹)ᵀ;  ∇bℓE=δℓ
```

Averaging over m examples, J=(1/m)ΣᵣEᵣ, averages the gradients in the same way. Adding the term (λ/2)Σℓ‖Wℓ‖² adds λWℓ to the weight gradient; whether biases are regularised at all is a separate convention. The examples below are single-example and unregularised.

```
Wℓ ← Wℓ−η∇WℓJ;  bℓ ← bℓ−η∇bℓJ,  η>0
```

Within one backward pass, every error signal must use the same pre-update set of weights. All gradients are computed first and only then are the parameters updated together, so that no downstream weight is updated early enough to contaminate an upstream gradient.

## 3 Common activations and output losses

```
Sigmoid: σ(z)=1/(1+e⁻ᶻ),  σ′(z)=σ(z)(1−σ(z))
ReLU:    r(z)=max(0,z),   r′=1 for z>0,  r′=0 for z<0
```

ReLU is not differentiable at zero; implementations usually take zero there as the subgradient. The ReLU example below deliberately keeps clear of the origin, and the central-difference perturbation does not cross it either.

```
linear-regression output:     E=½‖ŷ−y‖²,                     δᴸ=ŷ−y
Sigmoid binary cross-entropy: E=−y ln p−(1−y)ln(1−p),        δᴸ=p−y
```

The binary cross-entropy simplification comes from multiplying ∂E/∂p=(p−y)/[p(1−p)] by ∂p/∂z=p(1−p). Multi-class classification uses Softmax with cross-entropy, under the assumption Σᵢyᵢ=1:

```
pᵢ=eᶻⁱ/Σⱼeᶻʲ;  E=−Σᵢyᵢln pᵢ
∂pᵢ/∂zⱼ=pᵢ(𝟙ᵢ₌ⱼ−pⱼ)
∂E/∂zⱼ=−Σᵢyᵢ(𝟙ᵢ₌ⱼ−pⱼ)=pⱼ−yⱼ
```

Softmax cannot simply borrow the derivative of an elementwise activation; the derivation above already contains the action of its full Jacobian. The numerical work uses Softmax with the largest logit subtracted, and a general implementation of cross-entropy is better computed directly with log-sum-exp, which keeps both overflow and underflow in check.

## 4 Verification method and pass criterion

```
g_numeric_i=[E(θ+εeᵢ)−E(θ−εeᵢ)]/(2ε),  ε=10⁻⁶
```

One parameter is perturbed at a time with all others held fixed, and this central difference, which is independent of the backward formulas, is compared term by term against the analytic gradient. Every parameter is listed below to six decimals; the actual update and the error comparison use unrounded values. In smooth regions the truncation error of the central difference is O(ε²), while an ε that is too small brings floating-point cancellation. A second check asks whether the original loss falls after one update.

## 5 Example 1: Sigmoid hidden layer with squared error

The structure is 1→1→1. With x=2, y=1, a Sigmoid hidden layer, a linear output and E=½(ŷ−1)², the parameters in order are w, b, v, c, initialised to [0.5, 0.1, 0.8, -0.2]; the learning rate is η=0.1.

Forward pass and error signals: z₁=1.100000, h=0.750260, ŷ=0.400208; δ₂=ŷ−1=-0.599792; δ₁=δ₂vh(1−h)=-0.089906.

By the chain rule: ∂E/∂v=δ₂h, ∂E/∂c=δ₂, ∂E/∂w=δ₁x, ∂E/∂b=δ₁.

| parameter | analytic gradient | central difference | after update |
| --- | --- | --- | --- |
| w | -0.179813 | -0.179813 | 0.517981 |
| b | -0.089906 | -0.089906 | 0.108991 |
| v | -0.450000 | -0.450000 | 0.845000 |
| c | -0.599792 | -0.599792 | -0.140021 |

Result: the largest absolute gradient error is 3.886e-11; E goes from 0.179875171 to 0.124507510, a decrease of 0.055367661. Every parameter passes the 10⁻⁷ absolute-error threshold.

## 6 Example 2: ReLU hidden layer with squared error

The structure is 1→2→1. With x=1, y=1, a ReLU hidden layer, a linear output and E=½(ŷ−1)², the parameters in order are w₁, w₂, b₁, b₂, v₁, v₂, c, initialised to [0.5, -1.0, 0.1, -0.2, 0.4, -0.3, 0.2]; the learning rate is η=0.05.

Forward pass and error signals: z=(0.600000, -1.200000), h=(0.600000, 0.000000), ŷ=0.440000; δ₂=-0.560000.

By the chain rule: δ₁ᵢ=δ₂vᵢ𝟙(z₁ᵢ>0), ∂E/∂wᵢ=δ₁ᵢx, ∂E/∂bᵢ=δ₁ᵢ, ∂E/∂vᵢ=δ₂hᵢ. The second neuron has no gradient at all, since its ReLU is closed.

| parameter | analytic gradient | central difference | after update |
| --- | --- | --- | --- |
| w₁ | -0.224000 | -0.224000 | 0.511200 |
| w₂ | 0.000000 | 0.000000 | -1.000000 |
| b₁ | -0.224000 | -0.224000 | 0.111200 |
| b₂ | 0.000000 | 0.000000 | -0.200000 |
| v₁ | -0.336000 | -0.336000 | 0.416800 |
| v₂ | 0.000000 | 0.000000 | -0.300000 |
| c | -0.560000 | -0.560000 | 0.228000 |

Result: the largest absolute gradient error is 2.420e-11; E goes from 0.156800000 to 0.131371015, a decrease of 0.025428985. Every parameter passes the 10⁻⁷ absolute-error threshold.

## 7 Example 3: Sigmoid hidden layer with Softmax classification

The structure is 1→1→2. With x=1, y=(1,0), a Sigmoid hidden layer, a Softmax output and E=−ln p₁, the parameters in order are w, b, v₁, v₂, c₁, c₂, initialised to [0.5, 0.1, 0.3, -0.2, 0.1, -0.1]; the learning rate is η=0.1.

Forward pass and error signals: h=0.645656, logits=(0.293697, -0.229131), p=(0.627809, 0.372191); δ₂=(-0.372191, 0.372191), δ₁=-0.042576.

By the chain rule: δ₂=p−y, δ₁=(v₁δ₂₁+v₂δ₂₂)h(1−h); ∂E/∂vᵢ=δ₂ᵢh, ∂E/∂cᵢ=δ₂ᵢ.

| parameter | analytic gradient | central difference | after update |
| --- | --- | --- | --- |
| w | -0.042576 | -0.042576 | 0.504258 |
| b | -0.042576 | -0.042576 | 0.104258 |
| v₁ | -0.240308 | -0.240308 | 0.324031 |
| v₂ | 0.240308 | 0.240308 | -0.224031 |
| c₁ | -0.372191 | -0.372191 | 0.137219 |
| c₂ | 0.372191 | 0.372191 | -0.137219 |

Result: the largest absolute gradient error is 1.146e-10; E goes from 0.465519546 to 0.427181363, a decrease of 0.038338183. Every parameter passes the 10⁻⁷ absolute-error threshold.

## 8 What the checks establish, and what they do not

The three examples check, in turn, the product chain of a smooth activation, the piecewise gradient of ReLU, and the coupled derivatives of Softmax cross-entropy. Agreement with central differences is numerical evidence at these particular parameter values; correctness for general depth and width rests on the chain-rule derivation of section 2.

Where the loss is differentiable, E(θ−ηg)=E(θ)−η‖g‖²+O(η²), so a sufficiently small learning rate decreases the loss whenever the gradient is nonzero. The decreases observed in the three examples promise nothing about arbitrary learning rates or arbitrary initialisations, and they are no proof of a global minimum or of generalisation.

In a deep network the backward signal is a long product of weight matrices and activation derivatives, and it may vanish or explode. A saturated Sigmoid has a derivative close to zero, and the negative half-axis of ReLU has no local gradient whatsoever. Holding these factors in mind helps when reading a stalled training run, rather than blaming every stall on a bug.

## 9 A procedure that can be reproduced

For each example, start from the listed initial values and compute z, a and E; then work backwards from the output layer for δ and assemble the gradients of all parameters. Next, perturb each parameter by ±10⁻⁶ in turn, rerunning the forward pass to obtain central differences. Finally update all parameters together at the learning rate given in the table, and recompute the loss on the same example. Every number in this note comes from that procedure in double precision.
