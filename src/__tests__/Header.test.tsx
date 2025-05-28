import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

describe('Header', () => {
    it('メインタイトルとサブタイトルが正しく表示される', () => {
        render(<Header mainTitle="メイン" subTitle="サブ" />);
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('メイン');
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('サブ');
    });
});
