/**
 * @jest-environment jsdom
 */

import { container, screen, fireEvent, waitFor } from "@testing-library/dom"

import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { handleClickIconEye } from "../containers/Bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
        test("Then bill icon in vertical layout should be highlighted", async() => {

            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.Bills)
            await waitFor(() => screen.getByTestId('icon-window'))
            const windowIcon = screen.getByTestId('icon-window')
            expect(windowIcon.classList.contains('active-icon')).toBe(true)
                //to-do write expect expression
        })


        test("Then bill icon eye should be clickable", async() => {
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))
            router()
            window.onNavigate(ROUTES_PATH.Bills)
            document.body.innerHTML = BillsUI({ data: bills })

            await waitFor(() => screen.getAllByTestId('icon-eye'))
            let iconEye = screen.getAllByTestId('icon-eye')
                // let modale = screen.getByTestId('')



            for (let i = 0; i < iconEye.lenght; i++) {
                const handleClick = jest.fn((e) => e.preventDefault());

                iconEye[i].addEventListener("click", handleClick);
                // iconEye[i].addEventListener('click', handleClickIconEye(iconEye[i]))
                // expect(handleClickIconEye(iconEye[i].toHaveBeenCalled()))
                // expect(iconEye[i]).toBeTruthy()
                fireEvent.click(iconEye[i]);
                expect($('#modal-dialog')).toBeTruthy();

                // expect($('#modal-dialog').classList.contains('modal-dialog-centered modal-lg')).toBe(true)
                // expect(handleClickIconEye.toHaveBeenCalled())
            }


            // expect(EyeIcon.getAttribute('data-bill-url')).   

            // expect(EyeIcon.getAttribute('data-bill-url')).toEqual('http://localhost:5678/null')

            //to-do write expect expression
        })




        test("Then bills should be ordered from earliest to latest", () => {
            document.body.innerHTML = BillsUI({ data: bills })
            const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
            const antiChrono = ((a, b) => new Date(a.date) - new Date(b.date))
            const datesSorted = [...dates].sort(antiChrono)

            expect(dates).toEqual(datesSorted)
        })








        // test("Then handleClickNewBill function is well called", async() => {

        //     Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        //     window.localStorage.setItem('user', JSON.stringify({
        //         type: 'Employee'
        //     }))
        //     let root = document.createElement("div")
        //     root.setAttribute("id", "root")
        //     document.body.append(root)
        //     router()
        //     window.onNavigate(ROUTES_PATH.Bills)
        //     userEvent.click()
        //     await waitFor(() => screen.getByTestId('icon-window'))
        //     let windowIcon = screen.getByTestId('icon-window')
        //     expect(windowIcon.classList.contains('active-icon')).toBe(true)
        //         //to-do write expect expression

        // })


    })
})