export function initBars(): void {
  document.querySelectorAll<HTMLElement>('.bar_group').forEach((group) => {
    const max = parseFloat(group.dataset.max ?? '100');
    group
      .querySelectorAll<HTMLElement>('.bar_group__bar')
      .forEach((bar) => setupBar(bar, max));
  });

  function updateBars() {
    document.querySelectorAll<HTMLElement>('.bar_group__bar').forEach((bar) => {
      const rect = bar.getBoundingClientRect();
      if (rect.top < window.innerHeight - 45) {
        const value = parseFloat(bar.dataset.value ?? '0');
        const groupMax = parseFloat(
          bar.closest('.bar_group')?.getAttribute('data-max') ?? '100',
        );
        bar.style.width = `${(value / groupMax) * 100}%`;
      }
    });
  }

  updateBars();
  window.addEventListener('scroll', updateBars, { passive: true });
}

function setupBar(bar: HTMLElement, max: number): void {
  const label = bar.dataset.label;
  const unit = bar.dataset.unit ?? '';
  const showValues = bar.dataset.showValues === 'true';
  const tooltip = bar.dataset.tooltip === 'true';

  if (label) {
    const labelEl = document.createElement('p');
    labelEl.className = 'b_label';
    labelEl.textContent = label;
    bar.parentElement?.insertBefore(labelEl, bar);
  }

  if (tooltip) {
    bar.style.marginBottom = '40px';
    const tip = document.createElement('div');
    tip.className = 'b_tooltip';
    tip.innerHTML = `<span>${bar.dataset.value}</span><div class="b_tooltip--tri"></div>`;
    bar.appendChild(tip);
  }

  if (showValues) {
    bar.style.marginBottom = '40px';
    const minLabel = document.createElement('p');
    minLabel.className = 'bar_label_min';
    minLabel.textContent = unit ? `0 ${unit}` : '0';
    bar.appendChild(minLabel);

    const maxLabel = document.createElement('p');
    maxLabel.className = 'bar_label_max';
    maxLabel.textContent = unit ? `${max} ${unit}` : String(max);
    bar.appendChild(maxLabel);
  }
}
